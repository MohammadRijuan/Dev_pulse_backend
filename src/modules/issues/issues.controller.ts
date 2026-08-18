import { Request, Response } from 'express';
import { fail, success } from '../../utils/response';
import * as service from './issues.service';
import { findUserById } from '../auth/auth.service';
import httpStatus from 'http-status-codes';
import { StatusCodes } from 'http-status-codes';

export const create = async (req: Request, res: Response) => {
  const { title, description, type } = req.body;
  if (!title || !description || !type) return fail(res, 400, 'Missing fields');
  if (title.length > 150) return fail(res, 400, 'Title too long');
  if (description.length < 20) return fail(res, 400, 'Description too short');
  if (!req.user) return fail(res, 401, 'Unauthorized');
  try {
    const issue = await service.createIssue(title, description, type, req.user.id);
    return success(res, StatusCodes.CREATED, 'Issue created successfully', issue);
  } catch (err: any) {
    return fail(res, 500, 'Failed to create issue', err.message);
  }
};

export const list = async (req: Request, res: Response) => {
  const { sort, type, status } = req.query;
  try {
    const issues = await service.getIssues({ sort: String(sort || 'newest'), type: type ? String(type) : undefined, status: status ? String(status) : undefined });
    const reporterIds = Array.from(new Set(issues.map(i => i.reporter_id)));
    const reportersMap: Record<number, any> = {};
    if (reporterIds.length) {
      const rows = await Promise.all(reporterIds.map(id => findUserById(id)));
      rows.forEach((r: any) => { if (r) reportersMap[r.id] = { id: r.id, name: r.name, role: r.role }; });
    }
    const data = issues.map(i => ({ ...i, reporter: reportersMap[i.reporter_id] || null }));
    return success(res, StatusCodes.OK, 'Issues retrived successfully', data);
  } catch (err: any) {
    return fail(res, 500, 'Failed to get issues', err.message);
  }
};

export const getOne = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const issue = await service.getIssueById(id);
    if (!issue) return fail(res, 404, 'Issue not found');
    const reporter = await findUserById(issue.reporter_id);
    return success(res, StatusCodes.OK, 'Issue retrived successfully', { ...issue, reporter: reporter ? { id: reporter.id, name: reporter.name, role: reporter.role } : null });
  } catch (err: any) {
    return fail(res, 500, 'Failed to get issue', err.message);
  }
};

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { title, description, type } = req.body;
  if (!req.user) return fail(res, 401, 'Unauthorized');
  try {
    const existing = await service.getIssueById(id);
    if (!existing) return fail(res, 404, 'Issue not found');
    // permission check
    if (req.user.role === 'contributor') {
      if (existing.reporter_id !== req.user.id) return fail(res, 403, 'Cannot update others\' issues');
      if (existing.status !== 'open') return fail(res, 409, 'Cannot update issue unless status is open');
    }
    const updated = await service.updateIssue(id, { title, description, type });
    return success(res, StatusCodes.OK, 'Issue updated successfully', updated);
  } catch (err: any) {
    return fail(res, 500, 'Failed to update issue', err.message);
  }
};

export const remove = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!req.user) return fail(res, 401, 'Unauthorized');
  if (req.user.role !== 'maintainer') return fail(res, 403, 'Forbidden');
  try {
    await service.deleteIssue(id);
    return success(res, StatusCodes.OK, 'Issue deleted successfully', null);
  } catch (err: any) {
    return fail(res, 500, 'Failed to delete issue', err.message);
  }
};
