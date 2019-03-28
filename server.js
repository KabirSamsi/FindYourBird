//Sets up express server
const express = require('express')
const body_parser = require('body-parser')
const cookie_parser = require('cookie-parser')

const app = express()

app.set('view engine', "pug")
app.use(body_parser.urlencoded({extended: false}))
app.use(cookie_parser())
app.use(express.static(__dirname + 'public'))
app.use('/birds.js', express.static(__dirname + 'public'));

//Bird database
class Bird {
  constructor(name, img, description, appearance, diet, habitat, range) {
    this.name = name
    this.img = img
    this.description = description
    this.appearance = appearance
    this.diet = diet
    this.habitat = habitat
    this.range = range
  }
}

let birds = [
  new Bird("Great Horned Owl", "https://www.saczoo.org/wp-content/uploads/2016/12/Great-Horned-Owl-1.jpg", "The Great Horned Owl is the most abundant owl in North America. It is well known for its distinctive hooting sound, and bright yellow eyes. A nocturnal predator, it feeds on many different animals. It is able to turn its head 360°, making its hunting a lot easier.", "Yellow eyes, brown, black and white body, two large ear tufts, orange cheeks", "Mice, Rabbits, Snakes, Small Birds, Turkeys, Geese", "Wooded Forests, Swamps, Mountains, Tundra", "Throughout North America"),
  new Bird("Common Merganser", "https://download.ams.birds.cornell.edu/api/v1/asset/24977881/medium.jpg", "The Common Merganser is a large freshwater duck seen around the world. Its most distinctive characteristic is its serrated beak, used for catching fish, which gives it the nickname 'sawbill'. Unlike may other ducks, it nests in tree burrows alongisde the rivers which it fishes in.", "Sharp red beak, green head, white body with black black", "Small Fish", "Freshwater Lakes", "North America, Europe, Asia"),
  new Bird("Common Raven", "https://d1ia71hq4oe7pn.cloudfront.net/photo/70579921-480px.jpg", "The Common Raven is perhaps one of the most commonly seen birds. It can be seen everywhere, from urban areas to more rural regions. Along with crows, jays and other corvids, it is one of the most intelligent birds in the world.", "Black body, thick, black beak, short legs", "Omnivorous bird, eats things like nuts, carrion and insects.", "Most places, including urban areas, mountainous regions and forests", "Across the Northern Hemisphere, in places like the US"),
  new Bird("White Crowned Sparrow", "https://d1ia71hq4oe7pn.cloudfront.net/photo/71542141-480px.jpg", "The White-Crowned Sparrow is a small sparrow species found in the United States. It is named for the white stripes on its head. A common backyard bird, it can be found throughout suburban areas as well as in the wild.", "Small yellow beak, black head with white stripes, grey breast, alternating dark/light brown back", "Primarily seeds, such as sunflower and safflower seeds", "Suburban neighborhoods, open forests, mountains", "Throughout North America"),
  new Bird("Acorn Woodpecker", "https://19mvmv3yn2qc2bdb912o1t2n-wpengine.netdna-ssl.com/science/files/2017/04/Acorn_Woodpecker_on_black_oak_tree.jpg", "The Acorn Woodpecker is one of California's most common woodpeckers. Found almost exclusively in California, they are named for their primary food source, which they store in trees. They are well known for their loud <em>waka-waka</em> call. ", "Black back, white breast, large black and white eyes, red head, sharp black beak", "Acorns and other tree nuts, some insects", "Mountains and forests", "Mostly California, parts of Western Arizona"),
  new Bird("Dark Eyed Junco", "https://nationalzoo.si.edu/scbi/migratorybirds/featured_photo/images/bigpic/deju181.jpg", "The Dark-Eyed Junco is a common subspecies of the sparrow. It is quite small, creating a small <em>chip</em> sound which can sometimes barely be heard. It can be seen in both the wild and suburban areas.", "short pinkish-yellow beak, black head, dark rufous back, paleish pink breast, long tail", "Seeds, small insects", "Temperate regions such as mountains and forests, suburban areas", "Across North America"),
  new Bird("Canada Goose", "https://download.ams.birds.cornell.edu/api/v1/asset/51027681/large", "The Canada Goose is a large goose found throughout the United States and Canada. They are found throughout both wild areas and urban places like parks. Due to their large populations, they are considered pests. These geese are known for their honking cry.", "Large body, white and black face, black neck and legs, dark brown and coffee-colored breast, back and wings", "Primarily vegetation, sometimes small insects", "Open areas with vegetation such as near lakes", "United States and Canada"),
  new Bird("Northern Cardinal", "https://www.pennington.com/-/media/images/pennington-na/us/blog/wild-bird/northern-cardinals/northern-cardinal-og.jpg", "The Northern Cardinal is a songbird which lives on the East Coast of the United States. It can also be found in Eastern Canada, and even throughout the tropics and in parts of Hawai'i. It is well-known for its bright red color. They can be seen in both suburban neighborhoods near bird feeders as well as in the wild.", "Bright red body, black face, thick red bill, red crest", "Seeds, small insects", "Mountains, forests, suburban areas", "East Coast, Eastern Canada, Central America, Hawai'i"),
  new Bird("Bald Eagle", "https://insideclimatenews.org/sites/default/files/styles/colorbox_full/public/1200px-Adler_jagt_WikimediaUserAWWE83.jpg?itok=HOCB9xLs", "The Bald Eagle is one of the most majestic and easily recognizable birds in the United States. As the national bird, it is seen on many national symbols. One of the two eagle species found in the country, it has powerful eyesight, powerful talons and a majestic wingspan.", "Dark brown body, thick yellow beak, wide eyes, white head, white tail, yellow feet", "Primarily fish, other small aquatic animals", "Areas near water bodies, such as lakes and bays", "Mexico, United States, Canada, Alaska"),
  new Bird("Barn Owl", "https://d1ia71hq4oe7pn.cloudfront.net/photo/63738041-480px.jpg", "The Barn Owl is amongst the commonest owls in the United States. It is known for its hissing cry, and unique features. It can be seen in many backyards, woods and other areas. ", "White, heart-shaped face, two small black eyes, tannish body, white spotted legs and belly", "Mice, rats and other small rodents", "Typically more wooded or mountainous areas", "Throughout North America"),
  new Bird('Western Tanager','http://www.birdsandblooms.com/wp-content/uploads/2013/09/Western-Tanager-DaveRyan.jpg','The Western Tanager is one of the most common tanagers in the Western United States. It is known for its distinctive yellow and orange plumage.', 'Black Body, white-black tail, yellow head with orange crown', 'Seeds, vegetation', 'Open, mountainous areas', 'Western United States')
]

//Server routes
app.get('/', (req, res) => {
  res.render('index')
})

app.get('/search', (req, res) => {
  res.redirect('/')
})

app.post('/search', (req, res) => {
  let bird;
  for (let option of birds) {
    if (req.body.name.toLowerCase() == option.name.toLowerCase()) {
      bird = option
      res.cookie('bird_search', bird)
      res.render('index', {name: bird.name, image: bird.img, description: bird.description, appearance: bird.appearance, diet: bird.diet, habitat: bird.habitat, range: bird.range})
      break
    }
    if (bird == "") {
      res.render('index')
    }
  }
})

app.post('/add', (req, res) => {
  res.render('add')
})

app.get('/add', (req, res) => {
  res.render('add')
})

app.get('/sub', (req, res) => {
  res.redirect('/add')
})

app.post('/sub', (req, res) => {
  res.render('add')
  birds.push(new Bird(req.body.name, req.body.img, req.body.description, req.body.app, req.body.diet, req.body.habitat, req.body.range))
})

app.get('/edit', (req, res) => {
  res.redirect("/")
})

app.post('/edit', (req, res) => {
  let bird_cookie = req.cookies.bird_search
  res.render('edit', {name: bird_cookie.name, image: bird_cookie.img, range: bird_cookie.range, app: bird_cookie.appearance, diet: bird_cookie.diet, habitat: bird_cookie.habitat, desc: bird_cookie.description})
})

app.get('/upd', (req, res) => {
  res.redirect('/edit')
})

app.post('/upd', (req, res) => {
  for (let bird of birds) {
    let bird_cookie = req.cookies.bird_search
    if (bird.name.toLowerCase() == bird_cookie.name.toLowerCase()) {
      for (let attr in bird) {
        bird[attr] = req.body[attr]
      }
      res.render('index')
      break
    }
  }
})

//Runs server
app.listen(3000)
