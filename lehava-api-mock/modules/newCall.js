const lehavaData = require('../config/lehavaData');

module.exports = class Call {
    constructor(userId, category, description) {
        this.userId = userId;
        this.callObject = {
            "@COMMON_NAME": `${lehavaData.inRequests.in['@COMMON_NAME']}`,
            "description": `${description}`,
            "status": {
                "@COMMON_NAME": "פתוח"
            },
            "category": {
                "@COMMON_NAME": `${category}`
            },
            "open_date": Date.now()
        }
    }
    save() {
        lehavaData.activecalls[this.userId - 1].data.collection_in.cr.push(this.callObject);
    }
}