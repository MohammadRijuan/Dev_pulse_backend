import { query } from '../../utils/db';

export type IssueRow = {
  id: number;
  title: string;
  description: string;
  type: 'bug' | 'feature_request';
  status: 'open' | 'in_progress' | 'resolved';
  reporter_id: number;
  created_at: string;
  updated_at: string;
};

export const createIssue = async (title: string, description: string, type: 'bug' | 'feature_request', reporter_id: number) => {
  const text = `INSERT INTO issues(title,description,type,reporter_id) VALUES($1,$2,$3,$4) RETURNING *`;
  const { rows } = await query(text, [title, description, type, reporter_id]);
  return rows[0] as IssueRow;
};

export const getIssues = async (filters: { type?: string; status?: string; sort?: string }) => {
  const where: string[] = [];
  const params: any[] = [];
  let idx = 1;
  if (filters.type) { where.push(`type=$${idx++}`); params.push(filters.type); }
  if (filters.status) { where.push(`status=$${idx++}`); params.push(filters.status); }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const order = filters.sort === 'oldest' ? 'ASC' : 'DESC';
  const text = `SELECT * FROM issues ${whereSql} ORDER BY created_at ${order}`;
  const { rows } = await query(text, params);
  return rows as IssueRow[];
};

export const getIssueById = async (id: number) => {
  const { rows } = await query('SELECT * FROM issues WHERE id=$1', [id]);
  return rows[0] as IssueRow | undefined;
};

export const updateIssue = async (id: number, fields: { title?: string; description?: string; type?: string }) => {
  const sets: string[] = [];
  const params: any[] = [];
  let idx = 1;
  if (fields.title) { sets.push(`title=$${idx++}`); params.push(fields.title); }
  if (fields.description) { sets.push(`description=$${idx++}`); params.push(fields.description); }
  if (fields.type) { sets.push(`type=$${idx++}`); params.push(fields.type); }
  params.push(id);
  const text = `UPDATE issues SET ${sets.join(',')}, updated_at=now() WHERE id=$${idx} RETURNING *`;
  const { rows } = await query(text, params);
  return rows[0] as IssueRow;
};

export const deleteIssue = async (id: number) => {
  await query('DELETE FROM issues WHERE id=$1', [id]);
};
