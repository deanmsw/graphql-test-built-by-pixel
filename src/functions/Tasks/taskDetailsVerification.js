import { AuthenticationError } from 'apollo-server';

export const taskDetailsVerification = {
    type: `type TaskDetailsVerificationResponse { success: Boolean error: String}`,
    args: {
        title: 'String',
        description: 'String',
    },
    resolve: async (parent, args, context, info) => {
        if (!context.user) {
            throw new AuthenticationError('Must be logged in');
        }
        var phoneExp =
            /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/gim;

        var emailExp =
            /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])?/gim;

        const titleHasPhoneNumber = args.title.search(phoneExp) >= 0;
        const descriptionHasPhoneNumber =
            args.description.search(phoneExp) >= 0;

        const titleHasEmail = args.title.search(emailExp) >= 0;
        const descriptionHasEmail = args.description.search(emailExp) >= 0;

        if (titleHasPhoneNumber) {
            return {
                error: 'We have detected a phone number in your task title.  Phone numbers are not allowed.',
            };
        }
        if (descriptionHasPhoneNumber) {
            return {
                error: 'We have detected a phone number in your task description.  Phone numbers are not allowed.',
            };
        }
        if (titleHasEmail) {
            return {
                error: 'We have detected an email address in your task title.  Email addresses are not allowed.',
            };
        }
        if (descriptionHasEmail) {
            return {
                error: 'We have detected an email address in your task description.  Email addresses are not allowed.',
            };
        }

        return { success: true, error: null };
    },
};
