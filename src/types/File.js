import { schemaComposer } from 'graphql-compose';

export const FileTC = schemaComposer.createObjectTC({
    name: 'File',
    fields: {
        filename: 'String!',
        mimetype: 'String!',
        encoding: 'String!',
    },
});
