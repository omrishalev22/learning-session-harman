package com.guild.search;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("com.guild.search")
public class Application {

	private static final Logger log = LoggerFactory.getLogger(Application.class);

	public static void main(String[] args) {

		SpringApplication.run(Application.class, args);
	}

	@Bean
	public CommandLineRunner demo(PearlRepository repository) {
		return (args) -> {
			if (repository.count() == 0) {
				loadDb(repository);
				// save a couple of Pearls
			}

			// fetch all Pearls
			log.info("Pearls found with findAll():");
			log.info("-------------------------------");
			for (Pearl Pearl : repository.findAll()) {
				log.info(Pearl.toString());
			}
			log.info("");

			// fetch an individual Pearl by ID
			repository.findById(1L)
					.ifPresent(Pearl -> {
						log.info("Pearl found with findById(1L):");
						log.info("--------------------------------");
						log.info(Pearl.toString());
						log.info("");
					});

			// fetch Pearls by last name
			log.info("Pearl found with findByLastName('Bauer'):");
			log.info("--------------------------------------------");
			repository.findByName("Bauer").forEach(bauer -> {
				log.info(bauer.toString());
			});
			// for (Pearl bauer : repository.findByLastName("Bauer")) {
			// 	log.info(bauer.toString());
			// }
			log.info("");
		};
	}

	private void loadDb(PearlRepository repository) {
		repository.save(new Pearl("omri", "מה זה הרעש הזה? רון? חאלס עם המטבעות פוקר האלה, מה יהיה ענת עם ההקלדות, מה זה המוזיקה הזאת"));
		repository.save(new Pearl("ido", "טוב אני הולך, הייתי נשאר אבל לא בא לי - הוד השרון שולטת"));
		repository.save(new Pearl("raz", "רז מה הזמנת לאכול? פיאנו פיאנו סניף חדרה"));
		repository.save(new Pearl("anat", "מי נגע במזגן?  - השלט אצלה ביד"));
		repository.save(new Pearl("matthew", "תגיד אתה הזמנת כבר מסמסונג יפן? שמעתי יש לו 3 אחוז הנחה על בטריות"));
		repository.save(new Pearl("ron", "אני נראה לי הולך לשולץ מי בא לשולץ רוצה שולץ.. מזמין להסלטה"));
		repository.save(new Pearl("yafit", "לא לגעת בספרינט 6 אני עליו , גם לא ב5 או 4 3 2 1 , למה מה אתה צריך?"));
		repository.save(new Pearl("guyw", "מאז שאני אוכל לה סלטה יש לי כאבי בטן .. מזמין לה סלטה"));
		repository.save(new Pearl("guys", "-10:30 בדיוק- אין דילי?"));
		repository.save(new Pearl("oleg", "- צועק בטון שלדעתו נחמד - חברים אני סיימתי פי איצ די שאתם כתבתם \"שלום עולם\" בפעם הראשונה"));

	}
}
