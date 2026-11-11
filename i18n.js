'use strict';
// English keys are shared by the templates and catalogue; stored data keeps stable IDs.
const localeMessages = new Map();
function addTranslations(rows){for(const [en,fr,ar] of rows)localeMessages.set(en,{en,fr,ar});}
addTranslations([
['STC Official','STC officiel','موقع STC الرسمي'],
['Language','Langue','اللغة'],['Skip to content','Aller au contenu','انتقل إلى المحتوى'],['STC Geonara home','Accueil STC Geonara','الصفحة الرئيسية لـ STC Geonara'],
['THE EARTH SCIENCE WORKSPACE','VOTRE ESPACE EN GÉOSCIENCES','مساحتك لعلوم الأرض'],['Main navigation','Navigation principale','التنقل الرئيسي'],['Open navigation','Ouvrir le menu','فتح القائمة'],['Close navigation','Fermer le menu','إغلاق القائمة'],
['Overview','Accueil','الرئيسية'],['Dictionary','Dictionnaire','القاموس'],['Research','Recherche','الأبحاث'],['Messages','Messages','الرسائل'],['My profile','Mon profil','ملفي الشخصي'],['Dark mode','Mode sombre','الوضع الداكن'],['Switch to light mode','Passer au mode clair','التبديل إلى الوضع الفاتح'],['Switch to dark mode','Passer au mode sombre','التبديل إلى الوضع الداكن'],
['A NEW PERSPECTIVE ON EARTH SCIENCE','UN NOUVEAU REGARD SUR LES GÉOSCIENCES','نظرة جديدة إلى علوم الأرض'],['Go beneath','Au-delà','تعمّق'],['the surface.','de la surface.','تحت السطح.'],['Discover more.','Découvrez davantage.','اكتشف المزيد.'],
['From the first question to your next discovery. Explore geological knowledge, research, and ideas in one connected workspace.','De votre première question à votre prochaine découverte. Explorez les connaissances géologiques, la recherche et les idées dans un espace connecté.','من سؤالك الأول إلى اكتشافك التالي. استكشف المعرفة الجيولوجية والأبحاث والأفكار في مساحة واحدة مترابطة.'],
['Start exploring','Commencer à explorer','ابدأ الاستكشاف'],['Meet Swingo AI','Découvrez Swingo AI','تعرّف على Swingo AI'],['THE BIGGER PICTURE','UNE VISION PLUS LARGE','الصورة الأوسع'],['4.54 billion','4,54 milliards','٤٫٥٤ مليار'],['years of stories beneath our feet.','d’années d’histoire sous nos pieds.','سنة من القصص تحت أقدامنا.'],['EVERY LAYER TELLS A STORY','CHAQUE COUCHE RACONTE UNE HISTOIRE','كل طبقة تروي قصة'],
['Built for curious minds. Grounded in Earth science.','Pour les esprits curieux. Ancré dans les géosciences.','للعقول الفضولية. مستند إلى علوم الأرض.'],['Explore your workspace','Explorer votre espace','استكشف مساحتك'],['Earth science disciplines','Disciplines des géosciences','تخصصات علوم الأرض'],
['GEOLOGY','GÉOLOGIE','الجيولوجيا'],['SEDIMENTOLOGY','SÉDIMENTOLOGIE','علم الرسوبيات'],['STRATIGRAPHY','STRATIGRAPHIE','علم الطبقات'],['GEOCHEMISTRY','GÉOCHIMIE','الكيمياء الجيولوجية'],['EARTH SCIENCES','SCIENCES DE LA TERRE','علوم الأرض'],
['YOUR NEXT DISCOVERY STARTS HERE','VOTRE PROCHAINE DÉCOUVERTE COMMENCE ICI','اكتشافك القادم يبدأ هنا'],['A world of knowledge.','Un monde de connaissances.','عالم من المعرفة.'],['One place to explore.','Un seul espace à explorer.','مساحة واحدة للاستكشاف.'],['A considered set of tools for the way you learn,','Des outils pensés pour apprendre,','أدوات صُممت لتساعدك على التعلّم،'],['research, and connect with our planet.','chercher et comprendre notre planète.','والبحث، وفهم كوكبنا.'],
['The geological dictionary','Le dictionnaire géologique','القاموس الجيولوجي'],['Build your understanding, one concept at a time. Explore the language of our planet.','Approfondissez vos connaissances, un concept à la fois. Explorez le langage de notre planète.','ابنِ معرفتك مفهومًا بعد مفهوم. استكشف لغة كوكبنا.'],['Research without the noise','La recherche, en toute clarté','أبحاث أكثر وضوحًا'],['Find your next line of enquiry. Browse topics, explore ideas, and save what matters.','Trouvez votre prochaine piste. Parcourez les sujets, explorez les idées et gardez l’essentiel.','اعثر على مسارك البحثي التالي. تصفّح المواضيع واستكشف الأفكار واحفظ ما يهمك.'],['An introduction to research discovery','Une porte d’entrée vers la recherche','مدخل إلى اكتشاف الأبحاث'],['A more curious conversation','Une conversation qui éveille la curiosité','حوار يفتح آفاق الفضول'],['Meet Swingo AI. Work through geological questions and make complex ideas clearer.','Découvrez Swingo AI. Explorez vos questions géologiques et clarifiez les idées complexes.','تعرّف على Swingo AI. ناقش الأسئلة الجيولوجية وافهم الأفكار المعقّدة بوضوح.'],
['Illustration of sedimentary rock layers','Illustration de couches sédimentaires','رسم توضيحي لطبقات الصخور الرسوبية'],['UNDERSTANDING IS A JOURNEY','COMPRENDRE EST UN VOYAGE','الفهم رحلة'],['Small questions.','De petites questions.','أسئلة صغيرة.'],['Deeper connections.','Des liens plus profonds.','روابط أعمق.'],['What gives a rock its story? How does a basin evolve? Follow your curiosity from a geological term to a research topic, then explore it with Swingo AI.','Quelle histoire raconte une roche ? Comment évolue un bassin ? Suivez votre curiosité, d’un terme géologique à un sujet de recherche, puis explorez-le avec Swingo AI.','ما الذي يروي قصة الصخر؟ وكيف يتطور الحوض؟ اتبع فضولك من مصطلح جيولوجي إلى موضوع بحثي، ثم استكشفه مع Swingo AI.'],['Explore stratigraphy','Explorer la stratigraphie','استكشف علم الطبقات'],
['Learn more','En savoir plus','اعرف المزيد'],['Curiosity goes deeper.','La curiosité va plus loin.','الفضول يقود إلى العمق.'],['An independent space for Earth science.','Un espace indépendant pour les géosciences.','مساحة مستقلة لعلوم الأرض.'],['Explore','Explorer','استكشف'],['Your workspace','Votre espace','مساحتك'],
['A WORK IN PROGRESS','UN PROJET EN ÉVOLUTION','مشروع قيد التطوير'],['A little transparency.','En toute transparence.','بكل شفافية.'],['Got it','Compris','فهمت'],['Close dialog','Fermer la fenêtre','إغلاق النافذة'],
['THE LANGUAGE OF OUR PLANET','LE LANGAGE DE NOTRE PLANÈTE','لغة كوكبنا'],['Geological dictionary','Dictionnaire géologique','القاموس الجيولوجي'],['Follow a term. Find a connection. Explore concise definitions across the Earth sciences.','Suivez un terme. Trouvez un lien. Explorez des définitions concises dans les sciences de la Terre.','تتبّع مصطلحًا واكتشف الروابط. استكشف تعريفات موجزة في مختلف علوم الأرض.'],['EN · FR · العربية terms','Termes EN · FR · العربية','مصطلحات EN · FR · العربية'],['Search geological concepts','Rechercher des concepts géologiques','ابحث عن مفاهيم جيولوجية'],['Search a concept, definition, or translated term…','Rechercher un concept, une définition ou une traduction…','ابحث عن مفهوم أو تعريف أو مصطلح مترجم…'],['Discipline','Discipline','التخصص'],['All disciplines','Toutes les disciplines','جميع التخصصات'],['Clear filters','Effacer les filtres','مسح عوامل التصفية'],['No matching concepts.','Aucun concept correspondant.','لا توجد مفاهيم مطابقة.'],['Try another term or choose all disciplines.','Essayez un autre terme ou toutes les disciplines.','جرّب مصطلحًا آخر أو اختر جميع التخصصات.'],
['FOLLOW YOUR NEXT QUESTION','SUIVEZ VOTRE PROCHAINE QUESTION','اتبع سؤالك التالي'],['Research discovery','Découverte de la recherche','اكتشاف الأبحاث'],['Search research','Rechercher des travaux','البحث في الأبحاث'],['Search a topic or research title…','Rechercher un sujet ou un titre…','ابحث عن موضوع أو عنوان بحث…'],['Research topic','Sujet de recherche','الموضوع البحثي'],['All topics','Tous les sujets','جميع المواضيع'],['Publication year','Année de publication','سنة النشر'],['All years','Toutes les années','جميع السنوات'],['All records','Toutes les notices','جميع السجلات'],['Research article','Article de recherche','مقال بحثي'],['Review','Article de synthèse','مقال مراجعة'],['Save record','Enregistrer','حفظ السجل'],['Saved','Enregistré','محفوظ'],['No records match your filters.','Aucune notice ne correspond aux filtres.','لا توجد سجلات تطابق عوامل التصفية.'],['Try a broader topic or clear your filters.','Essayez un sujet plus large ou effacez les filtres.','جرّب موضوعًا أوسع أو امسح عوامل التصفية.'],
['MAKE ROOM FOR CURIOSITY','LAISSEZ PLACE À LA CURIOSITÉ','امنح فضولك مساحة'],['Meet Swingo AI.','Découvrez Swingo AI.','تعرّف على Swingo AI.'],['A companion for your geological questions. Start with a concept and see where curiosity takes you.','Un compagnon pour vos questions géologiques. Partez d’un concept et suivez votre curiosité.','رفيق لأسئلتك الجيولوجية. ابدأ بمفهوم ودع فضولك يقودك.'],['A GOOD PLACE TO START','UN BON POINT DE DÉPART','نقطة بداية جيدة'],['Explore a question','Explorer une question','استكشف سؤالًا'],['Porosity vs permeability','Porosité et perméabilité','المسامية والنفاذية'],['Read the rock record','Lire les archives rocheuses','اقرأ السجل الصخري'],['Understand sedimentary facies','Comprendre les faciès sédimentaires','افهم السحنات الرسوبية'],['What happens after deposition?','Que se passe-t-il après le dépôt ?','ماذا يحدث بعد الترسيب؟'],['What is the difference between porosity and permeability?','Quelle est la différence entre porosité et perméabilité ?','ما الفرق بين المسامية والنفاذية؟'],['Explain the main principles of stratigraphy.','Expliquez les grands principes de la stratigraphie.','اشرح المبادئ الأساسية لعلم الطبقات.'],['What is a sedimentary facies?','Qu’est-ce qu’un faciès sédimentaire ?','ما هي السحنة الرسوبية؟'],['Explain diagenesis.','Expliquez la diagenèse.','اشرح التصخر.'],
['A note on this assistant','À propos de cet assistant','ملاحظة حول المساعد'],['Start a new conversation','Nouvelle conversation','ابدأ محادثة جديدة'],['Swingo AI conversation','Conversation avec Swingo AI','محادثة Swingo AI'],['A little curiosity goes a long way.','La curiosité ouvre de nouveaux horizons.','القليل من الفضول يفتح آفاقًا واسعة.'],['Assistant messages','Messages de l’assistant','رسائل المساعد'],['Hi, I’m Swingo AI. Let’s look a little deeper.\n\nAsk me about porosity, permeability, stratigraphy, sedimentary facies, or diagenesis.','Bonjour, je suis Swingo AI. Explorons un peu plus loin.\n\nPosez-moi une question sur la porosité, la perméabilité, la stratigraphie, les faciès sédimentaires ou la diagenèse.','مرحبًا، أنا Swingo AI. لنستكشف بعمق أكبر.\n\nاسألني عن المسامية أو النفاذية أو علم الطبقات أو السحنات الرسوبية أو التصخر.'],['Your geological question','Votre question géologique','سؤالك الجيولوجي'],['What are you curious about?','Qu’aimeriez-vous comprendre ?','ما الذي يثير فضولك؟'],['Send','Envoyer','إرسال'],['Preparing a response…','Préparation d’une réponse…','جارٍ إعداد الإجابة…'],
['YOUR LITTLE CORNER OF EARTH SCIENCE','VOTRE COIN DE GÉOSCIENCES','مساحتك الخاصة في علوم الأرض'],['Make yourself at home. Your profile and saved discoveries stay in this browser.','Installez-vous. Votre profil et vos découvertes enregistrées restent dans ce navigateur.','أهلًا بك في مساحتك. يبقى ملفك واكتشافاتك المحفوظة في هذا المتصفح.'],['Open your collection','Ouvrir votre collection','افتح مجموعتك'],['Display name','Nom affiché','الاسم الظاهر'],['Professional title','Titre professionnel','المسمّى المهني'],['Specialization','Spécialité','التخصص'],['Research interests','Centres d’intérêt scientifiques','الاهتمامات البحثية'],['A little about you','Quelques mots sur vous','نبذة عنك'],['Save profile','Enregistrer le profil','حفظ الملف'],['Saved on this device.','Enregistré sur cet appareil.','تم الحفظ على هذا الجهاز.'],['Updated for this visit.','Mis à jour pour cette visite.','تم التحديث لهذه الزيارة.'],['Please enter a display name.','Veuillez saisir un nom affiché.','يرجى إدخال اسم ظاهر.'],['Browser storage is unavailable. Changes last for this visit only.','Le stockage du navigateur est indisponible. Les modifications ne durent que pour cette visite.','تخزين المتصفح غير متاح. تستمر التغييرات لهذه الزيارة فقط.'],
['IDEAS ARE BETTER SHARED','LES IDÉES GAGNENT À ÊTRE PARTAGÉES','الأفكار تزدهر بالمشاركة'],['Conversations','Conversations','المحادثات'],['Sedimentology researcher','Chercheuse en sédimentologie','باحثة في علم الرسوبيات'],['Geologist','Géologue','جيولوجي'],['PhD candidate','Doctorante','باحثة دكتوراه'],['Local messages','Messages locaux','الرسائل المحلية'],['Messages are saved only in this browser. No delivery, live presence, or real users are connected.','Les messages sont enregistrés uniquement dans ce navigateur. Aucun envoi, statut en ligne ou utilisateur réel n’est connecté.','تُحفظ الرسائل في هذا المتصفح فقط. لا يوجد تسليم للرسائل أو حضور مباشر أو مستخدمون حقيقيون متصلون.'],
['Explore beneath the surface','Explorer sous la surface','استكشف ما تحت السطح'],['Earth Sciences','Sciences de la Terre','علوم الأرض'],['Geology','Géologie','الجيولوجيا'],['Sedimentology','Sédimentologie','علم الرسوبيات'],['Stratigraphy','Stratigraphie','علم الطبقات'],['Petrology','Pétrologie','علم الصخور'],['Petroleum Geology','Géologie pétrolière','جيولوجيا النفط'],['Structural Geology','Géologie structurale','الجيولوجيا البنيوية'],['Geomorphology','Géomorphologie','علم أشكال الأرض'],['Mineral Resources','Ressources minérales','الموارد المعدنية'],['Geochemistry','Géochimie','الكيمياء الجيولوجية'],['Mineralogy','Minéralogie','علم المعادن'],['Applied Geology','Géologie appliquée','الجيولوجيا التطبيقية'],['Palaeontology','Paléontologie','علم الأحافير']
]);

addTranslations([
['Choose avatar','Choisir un avatar','اختر صورة رمزية'],
['Upload photo','Importer une photo','رفع صورة'],
['Choose your avatar','Choisissez votre avatar','اختر صورتك الرمزية'],
['Pick a character or try a random one.','Choisissez un personnage ou laissez faire le hasard.','اختر شخصية أو جرّب اختيارًا عشوائيًا.'],
['Avatars','Avatars','الصور الرمزية'],
['Close avatar picker','Fermer le choix d’avatar','إغلاق اختيار الصورة الرمزية'],
['Surprise me','Au hasard','اختيار عشوائي'],
['Keep current','Garder l’avatar actuel','الاحتفاظ بالصورة الحالية'],
['Avatar updated.','Avatar mis à jour.','تم تحديث الصورة الرمزية.'],
['Research topics','Sujets de recherche','مواضيع بحثية'],
['Explore research topics.','Explorez les sujets de recherche.','استكشف المواضيع البحثية.'],
['Your conversations.','Vos conversations.','محادثاتك.'],
['Contacts','Contacts','جهات الاتصال'],
['Your message','Votre message','رسالتك'],
['Start a conversation.','Commencez une conversation.','ابدأ محادثة.'],
['Save message','Enregistrer le message','حفظ الرسالة'],



['Photo updated.','Photo mise à jour.','تم تحديث الصورة.'],
["Couldn't save photo.",'Impossible d’enregistrer la photo.','تعذّر حفظ الصورة.'],
['Saved.','Enregistré.','تم الحفظ.'],
["Couldn't save changes.",'Impossible d’enregistrer les modifications.','تعذّر حفظ التغييرات.'],
['About STC Geonara','À propos de STC Geonara','حول STC Geonara'],
['Geological knowledge, research topics, and Swingo AI.','Connaissances géologiques, sujets de recherche et Swingo AI.','المعرفة الجيولوجية والمواضيع البحثية وSwingo AI.'],
['Profile picture','Photo de profil','الصورة الشخصية'],
['Choose photo','Choisir une photo','اختر صورة'],
['Remove photo','Supprimer la photo','إزالة الصورة'],
['JPG, PNG or WebP · Up to 10 MB.','JPG, PNG ou WebP · 10 Mo maximum.','JPG أو PNG أو WebP · حتى 10 ميغابايت.'],
['Preparing photo…','Préparation de la photo…','جارٍ تجهيز الصورة…'],
['Photo saved on this device.','Photo enregistrée sur cet appareil.','تم حفظ الصورة على هذا الجهاز.'],
['Photo updated for this visit.','Photo mise à jour pour cette visite.','تم تحديث الصورة لهذه الزيارة.'],
['Photo removed.','Photo supprimée.','تمت إزالة الصورة.'],
['Choose a JPG, PNG or WebP image.','Choisissez une image JPG, PNG ou WebP.','اختر صورة بصيغة JPG أو PNG أو WebP.'],
['Choose an image smaller than 10 MB.','Choisissez une image de moins de 10 Mo.','اختر صورة أصغر من 10 ميغابايت.'],
['This image could not be opened. Try another photo.','Impossible d’ouvrir cette image. Essayez une autre photo.','تعذّر فتح هذه الصورة. جرّب صورة أخرى.'],
['Geological terminology','Terminologie géologique','المصطلحات الجيولوجية'],
['EARTH SCIENCE','SCIENCES DE LA TERRE','علوم الأرض'],
['Geology, research, and Swingo AI.','Géologie, recherche et Swingo AI.','الجيولوجيا والأبحاث وSwingo AI.'],
['years of Earth’s history.','ans d’histoire de la Terre.','سنة من تاريخ الأرض.'],
['Earth science, connected.','Les géosciences, connectées.','علوم الأرض، مترابطة.'],
['Your tools','Vos outils','أدواتك'],['Your tools.','Vos outils.','أدواتك.'],
['Explore geological terms and definitions.','Explorez les termes géologiques.','استكشف المصطلحات الجيولوجية وتعريفاتها.'],
['Browse topics. Save what matters.','Explorez les sujets. Gardez l’essentiel.','تصفّح المواضيع واحفظ ما يهمك.'],

['Explore your geological questions.','Explorez vos questions géologiques.','استكشف أسئلتك الجيولوجية.'],

['Read the layers.','Lisez les strates.','اقرأ الطبقات.'],
['Explore the stories preserved in rock.','Explorez les histoires inscrites dans la roche.','استكشف القصص المحفوظة في الصخور.'],
['Details','Détails','التفاصيل'],
['Geological terms, clearly defined.','Des termes géologiques clairement définis.','مصطلحات جيولوجية بتعريفات واضحة.'],
['Search terms…','Rechercher un terme…','ابحث عن مصطلح…'],
['Educational definitions · Review pending.','Définitions pédagogiques · Révision en attente.','تعريفات تعليمية · بانتظار المراجعة.'],
['Browse topics and save research examples.','Explorez les sujets et enregistrez des exemples.','تصفّح المواضيع واحفظ الأمثلة البحثية.'],
['Search research…','Rechercher des travaux…','ابحث في الأبحاث…'],

['Explore a geological question.','Explorez une question géologique.','استكشف سؤالًا جيولوجيًا.'],
['Try a question','Essayez une question','جرّب سؤالًا'],

['New conversation','Nouvelle conversation','محادثة جديدة'],
['Geology assistant','Assistant géologique','مساعد جيولوجي'],
['Ask about porosity, stratigraphy, facies, or diagenesis.','Posez une question sur la porosité, la stratigraphie, les faciès ou la diagenèse.','اسأل عن المسامية أو علم الطبقات أو السحنات أو التصخر.'],
['Ask a question…','Posez une question…','اطرح سؤالًا…'],
['Your profile and saved research.','Votre profil et vos recherches enregistrées.','ملفك وأبحاثك المحفوظة.'],
['About you','À propos de vous','نبذة عنك'],['Stored on this device.','Stocké sur cet appareil.','محفوظ على هذا الجهاز.'],
['Reset local data','Réinitialiser les données locales','إعادة ضبط البيانات المحلية'],



['Write a message…','Écrire un message…','اكتب رسالة…'],

['No matching terms.','Aucun terme correspondant.','لا توجد مصطلحات مطابقة.'],
['No matching records.','Aucune notice correspondante.','لا توجد سجلات مطابقة.'],
['About','À propos','حول الموقع'],

['Local prototype. Dictionary content needs review; research records are examples.','Prototype local. Le dictionnaire doit être révisé ; les notices de recherche sont des exemples.','نموذج محلي. محتوى القاموس يحتاج مراجعة، وسجلات الأبحاث أمثلة توضيحية.'],

['Your data stays on this device.','Vos données restent sur cet appareil.','تبقى بياناتك على هذا الجهاز.']
]);

const termContent=[
['Sédimentologie','علم الرسوبيات','Étude des sédiments, de leur origine, transport, dépôt et évolution après le dépôt.','دراسة الرواسب ونشأتها ونقلها وترسيبها وتطورها بعد الترسيب.'],
['Stratigraphie','علم الطبقات','Étude des couches rocheuses, de leur succession, répartition, corrélation et chronologie.','دراسة الطبقات الصخرية وتتابعها وتوزيعها ومضاهاة علاقاتها الزمنية.'],
['Diagenèse','التصخر','Transformations physiques, chimiques et biologiques des sédiments après leur dépôt et pendant leur lithification.','التغيرات الفيزيائية والكيميائية والحيوية التي تطرأ على الرواسب بعد ترسيبها وأثناء تحوّلها إلى صخر.'],
['Porosité','المسامية','Proportion du volume total d’une roche ou d’un sédiment occupée par les vides.','نسبة حجم الفراغات في الصخر أو الرواسب إلى الحجم الكلي.'],
['Perméabilité','النفاذية','Capacité d’un matériau poreux à laisser circuler les fluides dans ses pores connectés.','قدرة المادة المسامية على تمرير الموائع عبر المسام المتصلة.'],
['Faciès','السحنة','Ensemble rocheux présentant des caractères lithologiques, sédimentologiques ou paléontologiques distinctifs.','جسم صخري له خصائص صخرية أو رسوبية أو أحفورية مميزة.'],
['Lithologie','علم الصخور','Description physique d’une roche : composition minérale, taille des grains, texture et couleur.','الوصف الفيزيائي للصخر، بما يشمل تركيبه المعدني وحجم حبيباته ونسيجه ولونه.'],
['Discordance','عدم التوافق','Surface marquant une lacune du registre géologique due à l’érosion ou à l’absence de dépôt.','سطح يمثّل فجوة في السجل الجيولوجي ناتجة عن التعرية أو انقطاع الترسيب.'],
['Stratigraphie séquentielle','الطباقية التتابعية','Analyse des ensembles sédimentaires génétiquement liés et délimités par des surfaces d’importance stratigraphique.','تحليل الطبقات الرسوبية المرتبطة بنشأة مشتركة والمحدودة بأسطح ذات دلالة طباقية.'],
['Diapirisme','القباب الاختراقية','Remontée d’un matériau relativement mobile à travers des roches sus-jacentes plus denses.','صعود مادة قابلة للحركة نسبيًا عبر الصخور الأعلى منها والأكثر كثافة.'],
['Cône alluvial','مروحة غرينية','Dépôt sédimentaire en éventail formé à la sortie d’un écoulement canalisé d’une vallée ou d’un front montagneux.','جسم رسوبي مروحي الشكل يتكوّن عند خروج جريان محصور من وادٍ أو واجهة جبلية.'],
['Plateforme carbonatée','منصة كربوناتية','Vaste système de dépôt dominé par la production et l’accumulation de carbonates.','نظام ترسيبي واسع تهيمن عليه عمليات إنتاج الكربونات وتراكمها.'],
['Sédiment détritique','رواسب فتاتية','Sédiment composé de fragments provenant de roches ou de minéraux préexistants.','رواسب تتكوّن من فتات ناتج عن صخور أو معادن سابقة الوجود.'],
['Roche mère','صخر المصدر','Roche riche en matière organique pouvant produire des hydrocarbures dans des conditions thermiques favorables.','صخر غني بالمادة العضوية يستطيع توليد الهيدروكربونات في ظروف حرارية مناسبة.'],
['Roche réservoir','صخر الخزان','Roche dont la porosité efficace et la perméabilité permettent de stocker et transmettre des fluides.','صخر ذو مسامية فعالة ونفاذية كافيتين لتخزين الموائع ونقلها.']
];
termContent.forEach((r,i)=>{addTranslations([[seedTerms[i][0],r[0],r[1]],[seedTerms[i][2],r[2],r[3]]]);});
const answerContent=[
['porosity','La porosité est la part du volume total d’une roche occupée par des vides. La perméabilité décrit la facilité avec laquelle les fluides circulent dans les pores connectés. Elles sont liées, mais différentes : une roche peut être très poreuse et peu perméable si les passages entre les pores sont étroits ou mal connectés. Ce résumé pédagogique ne remplace pas les mesures pétrophysiques.','المسامية هي نسبة حجم الفراغات إلى الحجم الكلي للصخر. أما النفاذية فتصف سهولة حركة الموائع عبر المسام المتصلة. وهما مرتبطتان لكنهما غير متكافئتين: قد تكون المسامية عالية والنفاذية منخفضة إذا كانت أعناق المسام ضيقة أو ضعيفة الاتصال. هذا ملخص تعليمي، وتحتاج العينات الحقيقية إلى قياسات بتروفيزيائية.'],
['stratigraphy','Les principes de stratigraphie comprennent la superposition, l’horizontalité initiale, la continuité latérale, le recoupement et la succession des faunes. Ils servent à établir une chronologie relative et à corréler les unités géologiques. Leur application doit tenir compte des déformations, des discordances et du contexte local.','تشمل مبادئ علم الطبقات التراكب والأفقية الأصلية والاستمرارية الجانبية وعلاقات القطع والتعاقب الأحفوري. تساعد على تحديد التسلسل الزمني النسبي ومضاهاة الوحدات الجيولوجية. ويجب مراعاة التشوهات وعدم التوافق والسياق الجيولوجي المحلي عند تطبيقها.'],
['facies','Un faciès sédimentaire est un ensemble rocheux défini par une combinaison particulière de lithologie, structures sédimentaires, texture, fossiles et autres caractères. Son analyse aide à interpréter les processus et les milieux de dépôt. Ces interprétations doivent s’appuyer sur les relations de terrain et le contexte stratigraphique.','السحنة الرسوبية جسم صخري يتميز بمزيج من الصفات الصخرية والبنيات الرسوبية والنسيج والأحافير وغيرها. يُستخدم تحليل السحنات لتفسير عمليات الترسيب وبيئاته. ويجب دعم التفسيرات بالعلاقات الحقلية والسياق الطباقي.'],
['diagenesis','La diagenèse regroupe les processus physiques, chimiques et biologiques qui modifient les sédiments après leur dépôt et pendant leur lithification. Elle comprend notamment la compaction, la cimentation, la dissolution et les transformations minérales. Ces processus influencent la porosité et la perméabilité.','يشمل التصخر العمليات الفيزيائية والكيميائية والحيوية التي تغيّر الرواسب بعد ترسيبها وأثناء تحوّلها إلى صخر. ومن أبرزها الانضغاط والإسمنتة والإذابة والتحولات المعدنية. وتؤثر هذه العمليات في المسامية والنفاذية.'],
['weathering','L’altération des silicates implique des réactions entre les minéraux, l’eau et le CO₂ de l’atmosphère ou du sol. Sa vitesse et ses produits dépendent de la minéralogie, de la taille des grains, de la température, de l’eau disponible et de la chimie des solutions. Sa quantification nécessite des mesures minéralogiques et géochimiques.','تتضمن تجوية السيليكات تفاعلات كيميائية بين المعادن والماء وثاني أكسيد الكربون في الغلاف الجوي أو التربة. وتعتمد سرعتها ونواتجها على التركيب المعدني وحجم الحبيبات والحرارة وتوفّر الماء وكيمياء المحاليل. ويتطلب تقدير مساهمتها قياسات معدنية وجيوكيميائية.'],
['unknown','Posez une question sur la porosité, la perméabilité, la stratigraphie, les faciès ou la diagenèse.','جرّب سؤالًا عن المسامية أو النفاذية أو علم الطبقات أو السحنات أو التصخر.']
];
answerContent.forEach(([q,fr,ar])=>addTranslations([[aiAnswer(q),fr,ar]]));
let currentLanguage='en';
try{const saved=localStorage.getItem('stc_geonara_language');if(['en','fr','ar'].includes(saved))currentLanguage=saved;}catch{}
function t(text){
 const raw=String(text??'');const key=raw.trim();if(currentLanguage==='en'||!key)return raw;
 const entry=localeMessages.get(key);if(entry)return raw.replace(key,entry[currentLanguage]);
 const suffix=key.match(/^(.*?)(\s*[↗↺↓✧])$/u);if(suffix&&localeMessages.has(suffix[1].trim()))return raw.replace(key,t(suffix[1].trim())+suffix[2]);
 const prefix=key.match(/^([✓＋]\s*)(.*)$/u);if(prefix&&localeMessages.has(prefix[2]))return raw.replace(key,prefix[1]+t(prefix[2]));
 const avatar=key.match(/^Avatar (\d+)$/);if(avatar)return currentLanguage==='ar'?`الصورة الرمزية ${avatar[1]}`:key;
 const unread=key.match(/^(\d+) unread messages?$/);if(unread)return currentLanguage==='fr'?(unread[1]==='1'?'1 message non lu':`${unread[1]} messages non lus`):`${unread[1]} رسالة غير مقروءة`;
 let m=key.match(/^(\d+) topics( in your collection)?$/);if(m)return currentLanguage==='fr'?`${m[1]} sujets${m[2]?' dans votre collection':''}`:`${m[1]} موضوعًا${m[2]?' في مجموعتك':''}`;
 m=key.match(/^(\d+) concepts to explore$/);if(m)return currentLanguage==='fr'?`${m[1]} concepts à explorer`:`${m[1]} مفهومًا للاستكشاف`;
 m=key.match(/^(\d+) of (\d+) concepts$/);if(m)return currentLanguage==='fr'?`${m[1]} concepts sur ${m[2]}`:`${m[1]} من ${m[2]} مفهومًا`;
 m=key.match(/^Saved records \((\d+)\)$/);if(m)return currentLanguage==='fr'?`Notices enregistrées (${m[1]})`:`السجلات المحفوظة (${m[1]})`;
 m=key.match(/^(\d+) sample records( in your collection)?$/);if(m)return currentLanguage==='fr'?`${m[1]} notices d’exemple${m[2]?' dans votre collection':''}`:`${m[1]} سجل توضيحي${m[2]?' في مجموعتك':''}`;
 m=key.match(/^(\d+) saved research records$/);if(m)return currentLanguage==='fr'?`${m[1]} notices de recherche enregistrées`:`${m[1]} سجل بحثي محفوظ`;
 // Translate compound metadata without changing original publication identifiers.
 if(key.includes(' · '))return raw.replace(key,key.split(' · ').map(part=>t(part)).join(' · '));
 return raw;
}
const shellOriginals=new WeakMap();
function localizeRegion(region,remember=false){
 if(!region)return;
 const walker=document.createTreeWalker(region,NodeFilter.SHOW_TEXT);
 for(let node=walker.nextNode();node;node=walker.nextNode()){
  if(!node.parentElement)continue;
  if(node.parentElement.closest('[data-user-content],script,style,textarea,[lang]:not(html)'))continue;
  const source=remember?(shellOriginals.get(node)||node.nodeValue):node.nodeValue;
  if(remember)shellOriginals.set(node,source);node.nodeValue=t(source);
 }
 for(const el of [...(region.nodeType===1?[region]:[]),...region.querySelectorAll('[aria-label],[placeholder],[title]')]){
  for(const attr of ['aria-label','placeholder','title'])if(el.hasAttribute(attr)){
   let originals=shellOriginals.get(el);if(!originals||typeof originals==='string'){originals={};shellOriginals.set(el,originals);}
   if(!(attr in originals))originals[attr]=el.getAttribute(attr);
   el.setAttribute(attr,t(originals[attr]));
  }
 }
}
function localizeHTML(html){if(currentLanguage==='en')return html;const template=document.createElement('template');template.innerHTML=html;localizeRegion(template.content);return template.innerHTML;}
function syncLanguage(){
 document.documentElement.lang=currentLanguage;document.documentElement.dir=currentLanguage==='ar'?'rtl':'ltr';
 document.querySelector('#language-select').value=currentLanguage;
 for(const selector of ['.header','footer','#about-dialog','.skip'])localizeRegion(document.querySelector(selector),true);
}

addTranslations([["No conversations yet.","Aucune conversation pour le moment.","لا توجد محادثات بعد."],["Image analysis is unavailable. Try again later.","L’analyse d’images est indisponible. Réessayez plus tard.","تحليل الصور غير متاح. حاول لاحقًا."],["Swingo could not respond. Try another question.","Swingo n’a pas pu répondre. Essayez une autre question.","تعذّر على Swingo الرد. جرّب سؤالًا آخر."]]);
