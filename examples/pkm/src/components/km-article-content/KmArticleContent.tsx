'use client';

import type React from 'react';
import { RichText, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import type { RichTextField } from '@sitecore-content-sdk/nextjs';

import { cn } from '@/lib/utils';

import {
  hasRichText,
  hasText,
  mergeKmArticleContentFields,
  topicLabel,
} from './km-article-content.fields';
import { iconForTopic } from './km-article-content.icons';
import type { KmArticleContentProps, KmTopicReference } from './km-article-content.props';

type ContentBlock = {
  id: string;
  label: string;
  field?: RichTextField;
};

type SectionDef = {
  id: string;
  number: string;
  title: string;
  blocks: ContentBlock[];
};

const KmArticleContentEmpty: React.FC = () => (
  <div className="border-border bg-muted/30 text-muted-foreground mx-auto max-w-4xl rounded-2xl border border-dashed p-8 text-sm">
    Knowledge Article fields are empty. Edit page fields (Title, Purpose, workflows, etc.) to populate
    this component.
  </div>
);

function TopicChip({ topic }: { topic: KmTopicReference }) {
  const label = topicLabel(topic);
  const Icon = iconForTopic(label);
  return (
    <span className="border-border bg-background text-foreground inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium shadow-sm">
      <span className="bg-primary/10 text-primary inline-flex size-7 items-center justify-center rounded-lg">
        <Icon className="size-4" aria-hidden />
      </span>
      {label}
    </span>
  );
}

function SectionNav({ sections }: { sections: { id: string; title: string; number: string }[] }) {
  if (sections.length === 0) return null;
  return (
    <nav
      aria-label="Article sections"
      className="border-border bg-muted/40 sticky top-4 hidden rounded-2xl border p-4 lg:block"
    >
      <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wide uppercase">
        On this page
      </p>
      <ol className="space-y-2">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="text-foreground/80 hover:text-primary group flex items-start gap-2 text-sm leading-snug transition-colors"
            >
              <span className="text-muted-foreground group-hover:text-primary mt-0.5 font-mono text-xs">
                {section.number}
              </span>
              <span>{section.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * KmArticleContent — context-only rendering of Knowledge Article page fields.
 * Sectioned layout with LOB / Peril Type icon chips in the header.
 */
export const Default: React.FC<KmArticleContentProps> = (props) => {
  const { params, isPageEditing: propIsEditing } = props;
  const { page } = useSitecore();
  const isEditing = propIsEditing !== undefined ? propIsEditing : page.mode.isEditing;

  const fields = mergeKmArticleContentFields(props, isEditing);
  const kbId = fields['KB-ID'];
  const title = fields.Title;
  const lob = fields.LOB || [];
  const perilTypes = fields['Peril type'] || [];

  const sections: SectionDef[] = [
    {
      id: 'purpose-and-scope',
      number: '01',
      title: 'Purpose and Scope',
      blocks: [{ id: 'purpose', label: 'Purpose', field: fields.Purpose }],
    },
    {
      id: 'fnol-workflow',
      number: '02',
      title: 'FNOL Workflow',
      blocks: [
        { id: 'intake-triggers', label: 'Intake Triggers', field: fields['Intake Triggers'] },
        {
          id: 'core-triage-questions',
          label: 'Core Triage Questions',
          field: fields['Core Triage Questions'],
        },
        {
          id: 'general-escalation-rules',
          label: 'General Escalation Rules',
          field: fields['General Escalation Rules'],
        },
      ],
    },
    {
      id: 'investigation-and-documentation',
      number: '03',
      title: 'Investigation and Documentation',
      blocks: [
        {
          id: 'site-inspection',
          label: 'Standard Site Inspection Rules',
          field: fields['Standard Site Inspection Rules'],
        },
        {
          id: 'photo-video',
          label: 'Photo / Video Standards',
          field: fields['Photo Video Standards'],
        },
        {
          id: 'general-mitigation',
          label: 'General Mitigation',
          field: fields['General Mitigation'],
        },
      ],
    },
    {
      id: 'reserving-and-payment',
      number: '04',
      title: 'Reserving and Payment',
      blocks: [
        {
          id: 'baseline-reserves',
          label: 'Baseline Reserve Guidelines',
          field: fields['Baseline Reserve Guidelines'],
        },
        {
          id: 'payment-triggers',
          label: 'General Payment Triggers',
          field: fields['General Payment Triggers'],
        },
      ],
    },
    {
      id: 'common-scenarios',
      number: '05',
      title: 'Common Scenarios',
      blocks: [
        { id: 'scenarios', label: 'Common Scenarios', field: fields['Common Scenarios'] },
      ],
    },
  ];

  const visibleSections = sections
    .map((section) => ({
      ...section,
      blocks: section.blocks.filter((block) => hasRichText(block.field) || isEditing),
    }))
    .filter((section) => section.blocks.length > 0);

  const hasHeader =
    hasText(kbId) ||
    hasText(title) ||
    lob.length > 0 ||
    perilTypes.length > 0 ||
    isEditing;

  if (!hasHeader && visibleSections.length === 0) {
    return <KmArticleContentEmpty />;
  }

  const sectionId = params?.RenderingIdentifier || 'km-article-content';

  return (
    <article
      id={sectionId}
      data-component="KmArticleContent"
      className={cn('@container km-article-content w-full', params?.styles)}
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-10 xl:gap-14">
          <div className="min-w-0">
            {hasHeader && (
              <header className="border-border from-muted/50 mb-10 space-y-5 rounded-2xl border bg-gradient-to-br to-transparent p-6 sm:p-8">
                {(hasText(kbId) || isEditing) && kbId && (
                  <Text
                    tag="p"
                    field={kbId}
                    className="text-muted-foreground font-mono text-xs font-semibold tracking-[0.14em] uppercase"
                  />
                )}
                {(hasText(title) || isEditing) && title && (
                  <Text
                    tag="h1"
                    field={title}
                    className="text-foreground text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-tight"
                  />
                )}

                {(lob.length > 0 || perilTypes.length > 0 || isEditing) && (
                  <div className="flex flex-col gap-4 pt-1">
                    {(lob.length > 0 || isEditing) && (
                      <div>
                        <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
                          Line of business
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {lob.length > 0 ? (
                            lob.map((topic) => (
                              <TopicChip key={topic.id || topic.name} topic={topic} />
                            ))
                          ) : (
                            <p className="text-muted-foreground text-sm">Select LOB topics on the page.</p>
                          )}
                        </div>
                      </div>
                    )}
                    {(perilTypes.length > 0 || isEditing) && (
                      <div>
                        <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
                          Peril type
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {perilTypes.length > 0 ? (
                            perilTypes.map((topic) => (
                              <TopicChip key={topic.id || topic.name} topic={topic} />
                            ))
                          ) : (
                            <p className="text-muted-foreground text-sm">
                              Select peril types on the page.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </header>
            )}

            <div className="space-y-10 sm:space-y-12">
              {visibleSections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  aria-labelledby={`${section.id}-heading`}
                  className="scroll-mt-24"
                >
                  <div className="mb-5 flex items-start gap-4 border-b border-border/80 pb-4">
                    <span
                      className="bg-primary text-primary-foreground mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-semibold"
                      aria-hidden
                    >
                      {section.number}
                    </span>
                    <h2
                      id={`${section.id}-heading`}
                      className="text-foreground text-xl font-semibold tracking-tight sm:text-2xl"
                    >
                      {section.title}
                    </h2>
                  </div>

                  <div className="space-y-8 pl-0 sm:pl-13">
                    {section.blocks.map((block) => (
                      <div key={block.id} id={block.id} className="scroll-mt-28">
                        {section.blocks.length > 1 && (
                          <h3 className="text-foreground mb-3 text-base font-semibold tracking-tight sm:text-lg">
                            {block.label}
                          </h3>
                        )}
                        {block.field && (
                          <RichText
                            field={block.field}
                            className="km-article-richtext text-muted-foreground max-w-none text-pretty text-base leading-relaxed [&_a]:text-primary [&_h2]:text-foreground [&_h3]:text-foreground [&_li]:my-1 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_strong]:text-foreground [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>

          <aside className="mt-10 lg:mt-0">
            <SectionNav
              sections={visibleSections.map(({ id, title, number }) => ({ id, title, number }))}
            />
          </aside>
        </div>
      </div>
    </article>
  );
};
