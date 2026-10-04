export const loadPaths = {
  ADMIN: {
    members: "/admin/users?role=MEMBER",
    trainers: "/admin/users?role=PT",
    staff: "/admin/staff",
    packages: "/admin/packages",
    assignments: "/admin/assignments",
    summary: "/admin/summary",
  },
  PT: {
    clients: "/pt/clients",
  },
  MEMBER: {
    overview: "/member/overview",
    packages: "/packages",
  },
};
