import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
    name: 'test',
    access: (allow) => ({
        'tests/{entity_id}/*': [
            allow.guest.to(['read']),
            allow.entity('identity').to(['read', 'write', 'delete'])
        ],
        'tests/pictures/*': [
            allow.authenticated.to(['read','write']),
            allow.guest.to(['read', 'write'])
        ],
    })
});
