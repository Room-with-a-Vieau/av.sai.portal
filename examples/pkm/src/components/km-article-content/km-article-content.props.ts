import type { Field, RichTextField } from '@sitecore-content-sdk/nextjs';

import type { ComponentProps } from '@/lib/component-props';
import type { ReferenceField } from '@/types/ReferenceField.props';

export type KmTopicReference = ReferenceField & {
  fields?: {
    titleRequired?: Field<string>;
    Title?: Field<string>;
  };
};

/**
 * Page fields from Knowledge Article template {42F8929A-83CD-48FE-92F0-8AAC46E6CC62}.
 * Sitecore field names with spaces are preserved; camelCase aliases accepted when present.
 */
export type KmArticleContentFields = {
  'KB-ID'?: Field<string>;
  Title?: Field<string>;
  LOB?: KmTopicReference[];
  'Peril type'?: KmTopicReference[];
  Purpose?: RichTextField;
  'Intake Triggers'?: RichTextField;
  'Core Triage Questions'?: RichTextField;
  'General Escalation Rules'?: RichTextField;
  'Standard Site Inspection Rules'?: RichTextField;
  'Photo Video Standards'?: RichTextField;
  'General Mitigation'?: RichTextField;
  'Baseline Reserve Guidelines'?: RichTextField;
  'General Payment Triggers'?: RichTextField;
  'Common Scenarios'?: RichTextField;
  // Layout Service / GraphQL aliases
  kbId?: Field<string>;
  title?: Field<string>;
  lob?: KmTopicReference[];
  perilType?: KmTopicReference[];
  purpose?: RichTextField;
  intakeTriggers?: RichTextField;
  coreTriageQuestions?: RichTextField;
  generalEscalationRules?: RichTextField;
  standardSiteInspectionRules?: RichTextField;
  photoVideoStandards?: RichTextField;
  generalMitigation?: RichTextField;
  baselineReserveGuidelines?: RichTextField;
  generalPaymentTriggers?: RichTextField;
  commonScenarios?: RichTextField;
};

export type KmArticleContentProps = ComponentProps & {
  fields?: KmArticleContentFields;
  isPageEditing?: boolean;
};
