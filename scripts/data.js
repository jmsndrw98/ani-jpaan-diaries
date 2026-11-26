/* Classic scripts intentionally keep this game usable from file://. */
'use strict';
window.Diary = {};
Diary.CHAPTERS = [
 {id:'kyoto',name:'Kyoto',subtitle:'Beneath the Sakura',season:'SPRING',color:'#d8a0ad',sky:['#d8dfc7','#a7bd90'],ground:['#a9bd83','#afc489','#b6c98e'],tree:'sakura',water:'#76aaa2',light:'#f6cf9b',goal:'Follow the falling petals',souvenir:'Sakura paper charm',stamp:'桜',activity:'tea',activityTitle:'A little bowl of matcha',activityText:'Warm the bowl, whisk the matcha, then pour. A small ritual worth slowing down for.',sequence:['Warm','Whisk','Pour'],landmark:'The old shrine',landmarkText:'A bell sounds somewhere beyond the red gate. Happy sits quietly beside Ani. Toti has a fallen petal balanced on his nose.',rest:'Beneath the cherry tree',restText:'The sky turns the color of peach tea. For a while, none of us needs to go anywhere.',secret:'A tiny fox carving',secretText:'Toti follows a trail of petals to a fox no taller than a teacup, tucked behind the old stone lantern.',shop:'The paper & tea shop',intro:'Kyoto greets us with wooden doorways, a distant bell, and more pink petals than Toti knows what to do with.'},
 {id:'nara',name:'Nara',subtitle:'The Little Wonders',season:'FOREST DAY',color:'#a7bc80',sky:['#cadbc0','#8fa780'],ground:['#91ad76','#9bb780','#a4bd85'],tree:'cedar',water:'#71a6a6',light:'#e7e2b1',goal:'Notice the little things',souvenir:'Pressed forest leaf',stamp:'森',activity:'picnic',activityTitle:'A riverside picnic',activityText:'Lay out the blanket, unpack the bento, and share a little water with Happy and Toti.',sequence:['Blanket','Bento','Water'],landmark:'The quiet deer grove',landmarkText:'We watch from the path as the deer wander between the trees. The best way to meet a wild neighbor is to give them room.',rest:'A pause by the river',restText:'The river does all the talking. Happy rests his chin on Ani’s knee while Toti watches a leaf sail downstream.',secret:'Toti’s hidden flower trail',secretText:'A twitch of Toti’s ears leads us along a tiny trail. Pale flowers spill between the stones, a little secret just for us.',shop:'The forest keepsake stand',intro:'Nara is all soft footfalls and green light. Today, we promise to leave plenty of room for small surprises.'},
 {id:'hakone',name:'Hakone',subtitle:'Between the Mountains',season:'SOFT RAIN',color:'#9eafbb',sky:['#b5c9ca','#7e9d98'],ground:['#96ac8b','#9cb391','#a7b996'],tree:'pine',water:'#739ca9',light:'#eacb9b',goal:'Find warmth in the rain',souvenir:'Little wooden puzzle box',stamp:'山',activity:'decorate',activityTitle:'Make the room our own',activityText:'Choose a cushion, a flower, and a little lantern for our tatami room. There is no wrong arrangement.',sequence:['Cushion','Flower','Lantern'],landmark:'The mountain viewpoint',landmarkText:'Beyond the lake, the mountain lifts its head through the clouds. Ani holds her parasol a little higher so the dogs can see.',rest:'Tea at the rainy ryokan',restText:'Steam curls from the cup. The rain eases, and a line of honey-colored light appears beneath the clouds.',secret:'A lakeside haiku',secretText:'On a weathered wooden sign: “Clouds cross the water / Three shadows share one shelter / Home can travel too.”',shop:'The woodcraft shop',intro:'Rain taps a quiet rhythm on the ryokan roof. We have tea, a warm room, and nowhere we need to hurry.'},
 {id:'tokyo',name:'Tokyo',subtitle:'A Thousand Little Lights',season:'FESTIVAL NIGHT',color:'#b58da8',sky:['#777e98','#546974'],ground:['#8b9d8a','#929f8e','#9ba794'],tree:'sakura',water:'#667f96',light:'#ffd088',goal:'Collect a little evening magic',souvenir:'Festival wind chime',stamp:'灯',activity:'festival',activityTitle:'The lantern melody',activityText:'Listen to a little melody, then tap the lanterns in the same order. Take as many tries as you like.',sequence:['Pink','Gold','Green'],landmark:'The lantern promenade',landmarkText:'A thousand little lights bob above our heads. Happy’s hat glows gold; Toti stops at every new smell.',rest:'The lights over the water',restText:'Lanterns drift into the evening. We stand very close together and watch their reflections turn into stars.',secret:'The last little wish',secretText:'Behind a stall is a wish card: “May the road bring you back to someone who is happy to see you.”',shop:'The festival keepsake stall',intro:'Tokyo is humming softly tonight. The festival has saved a place for three travelers with a very full journal.'}
];
Diary.LEVELS = [0,80,180,320,500,720,1000,1350];
Diary.REWARDS = ['New footsteps','Petal ribbon','Forest friend','Woven travel scarf','Little lantern','Seasoned wanderer','Memory keeper','A heart full of Japan'];
Diary.XP = {pet:5,feed:10,play:25,paw:10,souvenir:15,landmark:20,activity:25,secret:50,destination:100,photo:0,rest:0};
Diary.OBJECTS = [
 {id:'landmark',x:7,y:7,tx:9,ty:9,type:'landmark'},
 {id:'activity',x:17,y:7,tx:16,ty:9,type:'activity'},
 {id:'souvenir',x:6,y:16,tx:8,ty:16,type:'shop'},
 {id:'rest',x:17,y:15,tx:16,ty:15,type:'rest'},
 {id:'secret',x:3,y:12,tx:4,ty:12,type:'secret'},
 {id:'station',x:19,y:20,tx:18,ty:19,type:'station'}
];
Diary.TASKS = [['landmark','Visit the landmark'],['activity','Try a local ritual'],['souvenir','Find a keepsake'],['photo','Take a travel photo'],['rest','Share a quiet moment']];
Diary.level = xp => Math.min(Diary.LEVELS.length-1,Diary.LEVELS.filter(v=>xp>=v).length-1);
Diary.escape = text => String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
Diary.hash = (x,y,n=0) => {let v=Math.sin(x*127.1+y*311.7+n*74.7)*43758.5453;return v-Math.floor(v)};

Diary.MUSIC_TRACKS = [
 {id:'kawaranai',title:'Kawaranai Mono',src:'assets/audio/kawaranai-mono.m4a'},
 {id:'secret-base',title:'secret base ～君がくれたもの～ feat えみい',src:'assets/audio/secret-base.m4a'},
 {id:'sparkle',title:'Sparkle — movie ver.',src:'assets/audio/sparkle.m4a'},
 {id:'grand-escape',title:'Grand Escape (Movie Edit) feat Toko Miura',src:'assets/audio/grand-escape.m4a'}
];
Diary.MUSIC_DEFAULTS = ['kawaranai','secret-base','sparkle','grand-escape'];
