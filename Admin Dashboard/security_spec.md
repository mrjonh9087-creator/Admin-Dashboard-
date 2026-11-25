# Security Specification — Benzto2 Admin Authentication & Access Control

## 1. Data Invariants
1. **Identity & Verification**: All Firestore operations require `request.auth != null` AND `request.auth.token.email_verified == true`.
2. **Admin Bootstrap & Delegation**: Only the verified super admin (`fftra900@gmail.com`) can add or remove entries in `/authorizedAdmins/{adminId}` or read `/loginAudits/{auditId}`.
3. **Self-Only Profile Ownership**: A user may only create or update `/users/{userId}` where `userId == request.auth.uid`, `incoming().uid == request.auth.uid`, and `incoming().email == request.auth.token.email`.
4. **Immutable Audit Trail**: `/loginAudits/{auditId}` records can only be created for the caller's own verified identity and cannot be updated or deleted.
5. **Temporal Integrity**: All `createdAt` and `updatedAt` timestamps must strictly equal `request.time`.

## 2. Adversarial Test Payloads ("Dirty Dozen")
1. Unauthenticated write to `/users/attacker` -> `PERMISSION_DENIED`
2. Unverified email claim (`email: 'fftra900@gmail.com'`, `email_verified: false`) reading `/authorizedAdmins` -> `PERMISSION_DENIED`
3. Privilege escalation via shadow field (`{ uid, email, displayName, role: 'super_admin', createdAt, updatedAt }`) in `/users/{uid}` -> `PERMISSION_DENIED`
4. Identity spoofing (`uid: 'other_uid'`) in `/users/{callerUid}` -> `PERMISSION_DENIED`
5. Email spoofing (`email: 'fftra900@gmail.com'`) in `/loginAudits/{id}` when caller token email differs -> `PERMISSION_DENIED`
6. Oversized document ID (`> 128` chars or special chars like `../`) -> `PERMISSION_DENIED`
7. Non-super-admin writing to `/authorizedAdmins/{id}` -> `PERMISSION_DENIED`
8. Updating immutable `createdAt` or `email` on `/users/{uid}` -> `PERMISSION_DENIED`
9. Client-forged timestamp (`createdAt != request.time`) -> `PERMISSION_DENIED`
10. Modifying or deleting `/loginAudits/{id}` -> `PERMISSION_DENIED`
11. Reading another user's `/users/{otherUid}` document as a non-admin -> `PERMISSION_DENIED`
12. Deleting the super admin entry (`fftra900@gmail.com`) from `/authorizedAdmins` -> `PERMISSION_DENIED`
