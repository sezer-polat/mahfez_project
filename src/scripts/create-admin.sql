INSERT INTO "User" (
  "id",
  "name",
  "email",
  "password",
  "role",
  "phone",
  "address",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid(),
  'Admin',
  'admin@mahfez.com',
  '$2a$10$YourHashedPasswordHere', -- Bu kısmı bcrypt ile hash'lenmiş şifre ile değiştirin
  'ADMIN',
  '5555555555',
  'İstanbul',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING; 