const keys = require('./keys');

const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const subscriber = redisClient.duplicate();
const publisher = redisClient.duplicate();

const values = {
    omri: 'מה זה הרעש הזה? רון? חאלס עם המטבעות פוקר האלה, מה יהיה ענת עם ההקלדות, מה זה המוזיקה הזאת',
    ido: 'טוב אני הולך, הייתי נשאר אבל לא בא לי - הוד השרון שולטת',
    raz: 'רז מה הזמנת לאכול? פיאנו פיאנו סניף חדרה',
    anat: 'מי נגע במזגן?  - "השלט אצלה ביד',
    matthew: 'תגיד אתה הזמנת כבר מסמסונג יפן? שמעתי יש להם 3 אחוז הנחה על בטריות',
    ron: 'אני נראה לי הולך לשולץ מי בא לשולץ רוצה שולץ.. מזמין להסלטה',
    yafit: 'לא לגעת בספרינט 6 אני עליו , גם לא ב5 או 4 3 2 1 , למה מה אתה צריך?',
    guyw: 'מאז שאני אוכל לה סלטה יש לי כאבי בטן .. מזמין לה סלטה',
    guys: '-10:30 בדיוק- אין דילי?',
    default: 'No permissions go to DevOps'
}

function insertNewValue(payload) {
    if (!values[payload.name]) {
        values[payload.name] = payload.pearl;
        return values[payload.name];
    }
    return "Already Exists!"

}

function getMemberPhrase(teamMemberName) {
    return values[teamMemberName] ? values[teamMemberName] : values["default"];
}

subscriber.on('message', (channel, payload) => {
    if (channel === keys.channels.ADD) {
        let parsePayload = JSON.parse(payload);
        insertNewValue(parsePayload);
        publisher.publish(keys.channels.ADD_RES, parsePayload.name);
    } else {
        publisher.publish(keys.channels.SEARCH_RES, getMemberPhrase(payload));
    }
});

subscriber.subscribe(keys.channels.SEARCH);
subscriber.subscribe(keys.channels.ADD);
