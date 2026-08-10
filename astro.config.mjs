// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightOpenAPI, { openAPISidebarGroups } from 'starlight-openapi'
import starlightSidebarTopics from 'starlight-sidebar-topics';
import starlightLinksValidator from 'starlight-links-validator';
import tailwindcss from '@tailwindcss/vite';

import icon from 'astro-icon';

import d2 from 'astro-d2';

// https://astro.build/config
export default defineConfig({
    site: 'https://candig.github.io',
    base: 'candigv2-docs',
    vite: {
        plugins: [tailwindcss()]
    },
    integrations: [
        d2({output: "d2"}),
        icon({
            include: {
            mdi: ["*"]
        }
    }),
    starlight({
        title: 'Docs',
        customCss: [
            './src/styles/custom.css'
        ],
        favicon: '/favicon.ico',
        editLink: {
            baseUrl: 'https://github.com/CanDIG/candigv2-docs/edit/develop/'
        },
        logo: {
            src: './src/assets/my-logo.png',
            replacesTitle: true,
        },
        social: [{
            icon: 'github', label: 'GitHub', href:'https://github.com/candig/CanDIGv2',
        },],
    plugins: [
        starlightLinksValidator(),
        starlightOpenAPI([
            {
                base: 'technical/ingest-api',
                label: 'ingest api',
                schema: 'https://raw.githubusercontent.com/CanDIG/candigv2-ingest/refs/heads/stable/ingest_openapi.yaml',
                collapsed: true
            },
            {
                base: 'technical/query-api',
                label: 'query api',
                schema: 'https://raw.githubusercontent.com/CanDIG/candigv2-query/refs/heads/stable/query_server/openapi.yaml',
                collapsed: true
            },
            {
                base: 'technical/katsu-api',
                label: 'katsu api',
                schema: 'https://raw.githubusercontent.com/CanDIG/katsu/refs/heads/stable/chord_metadata_service/mohpackets/docs/schemas/schema_docs.yml',
                collapsed: true
            },
            {
                base: 'technical/drs/drs-api',
                label: 'drs api',
                schema: 'https://raw.githubusercontent.com/CanDIG/drs-service/refs/heads/stable/drs_server/drs_openapi.yaml',
                collapsed: true
            },
            {
                base: 'technical/htsget/beacon-api',
                label: 'htsget beacon api',
                schema: 'https://raw.githubusercontent.com/CanDIG/htsget_app/refs/heads/stable/htsget_server/beacon_openapi.yaml',
                collapsed: true
            },
            {
                base: 'technical/htsget/operations',
                label: 'htsget operations api',
                schema: 'https://raw.githubusercontent.com/CanDIG/htsget_app/refs/heads/stable/htsget_server/htsget_openapi.yaml',
                collapsed: true
            },
        {
                base: 'technical/federation-api',
                label: 'federation api',
                schema: 'https://raw.githubusercontent.com/CanDIG/federation_service/refs/heads/stable/candig_federation/federation.yaml',
                collapsed: true
            },
        ]),
        starlightSidebarTopics([
            {
                label: 'Deploy',
                link: '/deployment/local/',
                items: [
                    { label: 'Local deployment', slug: 'deployment/local' },
                    { label: 'Production deployment', slug: 'deployment/production' },
                    { label: 'Testing', slug: 'deployment/ingest-and-test' },
                    { label: 'Interact using Make', slug: 'deployment/interact-with-the-stack' },
                    { label: 'Logging', slug: 'deployment/logging' },
                    { label: 'Back up/Restore', slug: 'deployment/backup-restore-candig' },
                    { label: 'Troubleshooting', slug: 'deployment/stack-troubleshooting' },
                    { label: 'Update CanDIG', slug: 'deployment/update-candig' },
                ],
            },
            {
                label: 'Submit',
                link: '/ingest/',
                items: [
                    {
                        label: 'Data submission steps',
                        items: [
                            'ingest/prepare-clinical',
                            'ingest/register-programs',
                            'ingest/ingest-clinical',
                            'ingest/prepare-genomic',
                            'ingest/ingest-genomic',
                            'ingest/ingest-help',
                        ],
                    },
                ],
            },
            {
                label: 'User Roles',
                link: '/user-roles/',
                items: [
                    { label: 'Roles Overview', slug: 'user-roles/roles-overview' },
                    { label: 'Assign user roles', slug: 'user-roles/assign-roles' },
                    { label: 'DAC Authorization', slug: 'user-roles/dac-authorization' },
                    { label: 'User Notifications', slug: 'user-roles/user-notifications' },
                ],
            },
            {
                label: 'Explore',
                link: '/explore/',
                items: [
                    {
                        label: 'Exploring data on the portal',
                        items: [
                            'explore/summary',
                            'explore/clinical-genomic-search',
                            'explore/completeness',
                        ],
                    },
                ],
            },
            {
                label: 'Technical',
                link: '/technical/',
                items: [
                    { label: 'Architecture', slug: 'technical/architecture' },
                    { label: 'Docker and submods', slug: 'technical/docker-and-submodules' },
                    { label: 'API docs', slug: 'technical/api-docs' },
                    ...openAPISidebarGroups,
                ],
            },
        ]),
    ],
        })]
});