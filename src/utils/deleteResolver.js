const deleteResolver = (TC, model) => {
    return {
        type: `type DeletedAmount { total: Int}`,
        args: {
            input: ['String'],
        },
        resolve: async (source, args, context, info) => {
            let removed = 0;
            args.input.forEach(async (entry) => {
                await model.findByIdAndDelete(entry, function (err, docs) {
                    if (err) {
                        console.log(err);
                    } else {
                        removed = removed++;
                    }
                });
            });

            return { total: removed };
        },
    };
};

module.exports = { deleteResolver };
