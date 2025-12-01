import { Role } from "$/generated/prisma";
import { auth } from "@/lib/auth";
import { toStringSafe } from "@/lib/utils";
import type { Session } from "next-auth";

type AppSession = NonNullable<Session>;

const requireAuth = async (): Promise<AppSession> => {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session as AppSession;
};

const requireRole = async (allowed: Role | Role[]) => {
  const session = await requireAuth();
  const allowedRoles = Array.isArray(allowed) ? allowed : [allowed];
  if (!allowedRoles.includes(session.user.role)) {
    throw new Error("Forbidden");
  }
  return session;
};

const requireUserMatch = async (targetUserId: number | string) => {
  const session = await requireAuth();
  const sessionUserId = toStringSafe(session.user.id);
  if (sessionUserId !== toStringSafe(targetUserId)) {
    throw new Error("Forbidden");
  }
  return session;
};

export { requireAuth, requireRole, requireUserMatch };
