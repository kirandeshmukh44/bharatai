import { pgTable, serial, varchar, text, integer, timestamp, boolean, decimal, json } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('user'),
  organizationId: integer('organization_id').references(() => organizations.id),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Organizations table
export const organizations = pgTable('organizations', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  registrationId: varchar('registration_id', { length: 100 }),
  country: varchar('country', { length: 100 }),
  state: varchar('state', { length: 100 }),
  city: varchar('city', { length: 100 }),
  address: text('address'),
  website: varchar('website', { length: 255 }),
  contactEmail: varchar('contact_email', { length: 255 }),
  contactPhone: varchar('contact_phone', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow(),
});

// Suppliers table
export const suppliers = pgTable('suppliers', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').references(() => organizations.id),
  name: varchar('name', { length: 255 }).notNull(),
  registrationId: varchar('registration_id', { length: 100 }),
  country: varchar('country', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }),
  city: varchar('city', { length: 100 }),
  manufacturingLocation: text('manufacturing_location'),
  industry: varchar('industry', { length: 100 }),
  website: varchar('website', { length: 255 }),
  contactEmail: varchar('contact_email', { length: 255 }),
  contactPhone: varchar('contact_phone', { length: 50 }),
  yearsInOperation: integer('years_in_operation'),
  qualityScore: decimal('quality_score', { precision: 5, scale: 2 }),
  deliveryScore: decimal('delivery_score', { precision: 5, scale: 2 }),
  complianceScore: decimal('compliance_score', { precision: 5, scale: 2 }),
  financialStability: decimal('financial_stability', { precision: 5, scale: 2 }),
  previousIncidents: integer('previous_incidents').default(0),
  indigenousClaim: boolean('indigenous_claim').default(false),
  verificationStatus: varchar('verification_status', { length: 50 }).default('unverified'),
  riskLevel: varchar('risk_level', { length: 50 }).default('medium'),
  trustScore: decimal('trust_score', { precision: 5, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Components table
export const components = pgTable('components', {
  id: serial('id').primaryKey(),
  supplierId: integer('supplier_id').references(() => suppliers.id),
  name: varchar('name', { length: 255 }).notNull(),
  componentNumber: varchar('component_number', { length: 100 }),
  category: varchar('category', { length: 100 }).notNull(),
  manufacturer: varchar('manufacturer', { length: 255 }),
  countryOfOrigin: varchar('country_of_origin', { length: 100 }),
  manufacturingLocation: text('manufacturing_location'),
  indigenousStatus: varchar('indigenous_status', { length: 50 }).default('unknown'),
  description: text('description'),
  specifications: json('specifications'),
  certification: varchar('certification', { length: 255 }),
  verificationStatus: varchar('verification_status', { length: 50 }).default('unverified'),
  riskLevel: varchar('risk_level', { length: 50 }).default('medium'),
  trustScore: decimal('trust_score', { precision: 5, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Documents table
export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  supplierId: integer('supplier_id').references(() => suppliers.id),
  componentId: integer('component_id').references(() => components.id),
  documentType: varchar('document_type', { length: 100 }).notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  filePath: varchar('file_path', { length: 500 }),
  fileSize: integer('file_size'),
  mimeType: varchar('mime_type', { length: 100 }),
  verificationStatus: varchar('verification_status', { length: 50 }).default('pending'),
  uploadedBy: integer('uploaded_by').references(() => users.id),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
});

// Risk Assessments table
export const riskAssessments = pgTable('risk_assessments', {
  id: serial('id').primaryKey(),
  supplierId: integer('supplier_id').references(() => suppliers.id),
  componentId: integer('component_id').references(() => components.id),
  riskScore: decimal('risk_score', { precision: 5, scale: 2 }),
  riskLevel: varchar('risk_level', { length: 50 }),
  confidence: decimal('confidence', { precision: 4, scale: 3 }),
  assessmentSummary: text('assessment_summary'),
  factors: json('factors'),
  positiveFactors: json('positive_factors'),
  negativeFactors: json('negative_factors'),
  modelVersion: varchar('model_version', { length: 50 }),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// Verification Requests table
export const verificationRequests = pgTable('verification_requests', {
  id: serial('id').primaryKey(),
  supplierId: integer('supplier_id').references(() => suppliers.id),
  componentId: integer('component_id').references(() => components.id),
  requestedBy: integer('requested_by').references(() => users.id),
  requestType: varchar('request_type', { length: 50 }).notNull(),
  status: varchar('status', { length: 50 }).default('pending'),
  priority: varchar('priority', { length: 50 }).default('normal'),
  notes: text('notes'),
  reviewNotes: text('review_notes'),
  reviewedBy: integer('reviewed_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  reviewedAt: timestamp('reviewed_at'),
});

// Audit Logs table
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(),
  entityType: varchar('entity_type', { length: 50 }),
  entityId: integer('entity_id'),
  oldValues: json('old_values'),
  newValues: json('new_values'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  suppliers: many(suppliers),
}));

export const suppliersRelations = relations(suppliers, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [suppliers.organizationId],
    references: [organizations.id],
  }),
  components: many(components),
  documents: many(documents),
  riskAssessments: many(riskAssessments),
}));

export const componentsRelations = relations(components, ({ one, many }) => ({
  supplier: one(suppliers, {
    fields: [components.supplierId],
    references: [suppliers.id],
  }),
  documents: many(documents),
  riskAssessments: many(riskAssessments),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Organization = typeof organizations.$inferSelect;
export type Supplier = typeof suppliers.$inferSelect;
export type Component = typeof components.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type RiskAssessment = typeof riskAssessments.$inferSelect;
export type VerificationRequest = typeof verificationRequests.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
