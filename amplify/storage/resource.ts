import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
    name: 'noretaStorage',
    access: (allow) => ({
        'vehicle/list/*': [
            allow.guest.to(['read']),
        ],
    })
});