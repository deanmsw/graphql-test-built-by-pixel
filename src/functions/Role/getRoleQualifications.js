const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const getRoleQualifications = (TC, model) => {
    return {
        type: TC,
        args: {
            id: 'String',
        },
        description: 'Fetch the qualifications linked to this role',
        resolve: async (source, args, context, info) => {
            let docs = await model.aggregate([
                { $match: { _id: ObjectId(args.id) } },
                {
                    $lookup: {
                        from: 'qualifications',
                        localField: 'qualifications',
                        foreignField: '_id',
                        as: 'role_qualifications',
                    },
                },
            ]);

            return docs[0];
        },
    };
};

module.exports = { getRoleQualifications };
