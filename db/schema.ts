import {
  timestamp,
  pgTable,
  text,
  integer,
  serial,
  varchar,
  date
} from "drizzle-orm/pg-core"
 
export const users = pgTable(
  "users", 
  {
  user_id: serial("user_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  password: text("password").notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  email_verified: timestamp("email_verified", { withTimezone: true, mode: "date" }),
  phone: varchar("phone", { length: 20 }).unique(),
  role_permission: varchar("role_permission", { length: 50 }).notNull(),
});
 
export const claims = pgTable(
  "claims",
  {
    id: serial("id").primaryKey(),
    company: varchar("company").notNull(),
    model: varchar("model").notNull(),
    serial_number: varchar("serial_number").notNull(),
    status_id: integer("status_id").notNull(),
    action: text("action"),
    date: date("date", { mode: "date" }).notNull(),
    time: varchar("time"),
    last_update: timestamp("last_update", { withTimezone: true, mode: "date" }).defaultNow(),
  },
)

// export const accounts = pgTable(
//   "account",
//   {
//     userId: text("userId")
//       .notNull()
//       .references(() => users.id, { onDelete: "cascade" }),
//     type: text("type").$type<AdapterAccountType>().notNull(),
//     provider: text("provider").notNull(),
//     providerAccountId: text("providerAccountId").notNull(),
//     refresh_token: text("refresh_token"),
//     access_token: text("access_token"),
//     expires_at: integer("expires_at"),
//     token_type: text("token_type"),
//     scope: text("scope"),
//     id_token: text("id_token"),
//     session_state: text("session_state"),
//     name: text("name"),
//   },
//   (account) => [
//     {
//       compoundKey: primaryKey({
//         columns: [account.provider, account.providerAccountId],
//       }),
//     },
//   ]
// )
 
// export const verificationTokens = pgTable(
//   "verificationToken",
//   {
//     identifier: text("identifier").notNull(),
//     token: text("token").notNull(),
//     expires: timestamp("expires", { mode: "date" }).notNull(),
//   },
//   (verificationToken) => [
//     {
//       compositePk: primaryKey({
//         columns: [verificationToken.identifier, verificationToken.token],
//       }),
//     },
//   ]
// )
 
