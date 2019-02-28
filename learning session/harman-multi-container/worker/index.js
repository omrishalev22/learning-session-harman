const passwords = require('./keys').passwords;
const channels = require('./keys').channels;
const redis = require('redis');

const redisClient = redis.createClient({host: passwords.redisHost, port: passwords.redisPort, retry_strategy: () => 1000});
const subscriber = redis.createClient({host: passwords.redisHost, port: passwords.redisPort, retry_strategy: () => 1000});
const publisher = redis.createClient({host: passwords.redisHost, port: passwords.redisPort, retry_strategy: () => 1000});


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
        return "Success";
    }
    return "Already Exists!"

}

function getMemberPhrase(teamMemberName) {
    return values[teamMemberName] ? values[teamMemberName] : values["default"];
}

subscriber.on('message', (channel, payload) => {
    if (channels.NEW) {
        let parsePayload = JSON.parse(payload);
        console.log("parsePayload", parsePayload);
        console.log("inside the new channel");
        publisher.publish(channels.NEW,insertNewValue(parsePayload));
    } else {
        console.log("inside the search channel");
        publisher.publish(channels.SEARCH, getMemberPhrase(payload));
    }
});

subscriber.subscribe(channels.NEW);
subscriber.subscribe(channels.SEARCH);
