import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  useEffect(() => { api.get("/admin/users").then(({ data }) => setUsers(data)); }, []);
  return (
    <div data-testid="admin-users" className="space-y-6">
      <div>
        <div className="eyebrow text-[var(--text-mute)]">People</div>
        <h1 className="font-display font-black text-4xl mt-1">Users</h1>
      </div>
      <div className="bg-white border hairline-dark overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-admin)] eyebrow text-[var(--text-mute)]">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Provider</th>
              <th className="text-left p-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.user_id} className="border-t hairline">
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 uppercase font-semibold">{u.role}</td>
                <td className="p-3 capitalize">{u.provider}</td>
                <td className="p-3">{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
