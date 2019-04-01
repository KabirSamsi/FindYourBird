//Sets up express server
const express = require('express')
const body_parser = require('body-parser')
const cookie_parser = require('cookie-parser')

const app = express()

app.set('views', __dirname + '/Views');
app.set('view engine', "pug")
app.use(body_parser.urlencoded({extended: false}))
app.use(cookie_parser())

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
  new Bird("Common Merganser", "https://download.ams.birds.cornell.edu/api/v1/asset/24977881/medium.jpg", "The Common Merganser is a large freshwater duck seen around the world. Its most distinctive characteristic is its serrated beak, used for catching fish, which gives it the nickname 'sawbill'. Unlike many other ducks, it nests in tree burrows near the rivers which it fishes in.", "Sharp red beak, green head, white body with black black", "Small Fish", "Freshwater Lakes", "North America, Europe, Asia"),
  new Bird("Common Raven", "https://d1ia71hq4oe7pn.cloudfront.net/photo/70579921-480px.jpg", "The Common Raven is one of the most common and easily recognizable birds in the United States. It can be found everywhere, from crowded parking lots to the most secluded of wild areas. It is an extremely intelligent bird, as are all corvids.", "Dark grey and black body, thick beak, short legs", "Omnivorous bird, eats things like nuts, carrion and insects.", "Most places, including urban areas, mountainous regions and forests", "Across the Northern Hemisphere, in places like the US"),
  new Bird("White Crowned Sparrow", "https://d1ia71hq4oe7pn.cloudfront.net/photo/71542141-480px.jpg", "The White-Crowned Sparrow is a small sparrow species found in the United States. It is named for the white stripes on its head. A common backyard bird, it can be found throughout suburban areas as well as in the wild.", "Small yellow beak, black head with white stripes, grey breast, alternating dark/light brown back", "Primarily seeds, such as sunflower and safflower seeds", "Suburban neighborhoods, open forests, mountains", "Throughout North America"),
  new Bird("Acorn Woodpecker", "https://19mvmv3yn2qc2bdb912o1t2n-wpengine.netdna-ssl.com/science/files/2017/04/Acorn_Woodpecker_on_black_oak_tree.jpg", "The Acorn Woodpecker is one of California's most common woodpeckers. Found almost exclusively in California, they are named for their primary food source, which they store in trees. They are well known for their loud <em>waka-waka</em> call. ", "Black back, white breast, large black and white eyes, red head, sharp black beak", "Acorns and other tree nuts, some insects", "Mountains and forests", "Mostly California, parts of Western Arizona"),
  new Bird("Dark Eyed Junco", "https://nationalzoo.si.edu/scbi/migratorybirds/featured_photo/images/bigpic/deju181.jpg", "The Dark-Eyed Junco is a common subspecies of the sparrow. It is quite small, creating a small <em>chip</em> sound which can sometimes barely be heard. It can be seen in both the wild and suburban areas.", "short pinkish-yellow beak, black head, dark rufous back, paleish pink breast, long tail", "Seeds, small insects", "Temperate regions such as mountains and forests, suburban areas", "Across North America"),
  new Bird("Canada Goose", "https://download.ams.birds.cornell.edu/api/v1/asset/51027681/large", "The Canada Goose is a large goose found throughout the United States and Canada. They are found throughout both wild areas and urban places like parks. Due to their large populations, they are considered pests. These geese are known for their honking cry.", "Large body, white and black face, black neck and legs, dark brown and coffee-colored breast, back and wings", "Primarily vegetation, sometimes small insects", "Open areas with vegetation such as near lakes", "United States and Canada"),
  new Bird("Northern Cardinal", "https://www.pennington.com/-/media/images/pennington-na/us/blog/wild-bird/northern-cardinals/northern-cardinal-og.jpg", "The Northern Cardinal is a songbird which lives on the East Coast of the United States. It can also be found in Eastern Canada, and even throughout the tropics and in parts of Hawai'i. It is well-known for its bright red color. They can be seen in both suburban neighborhoods near bird feeders as well as in the wild.", "Bright red body, black face, thick red bill, red crest", "Seeds, small insects", "Mountains, forests, suburban areas", "East Coast, Eastern Canada, Central America, Hawai'i"),
  new Bird("Bald Eagle", "https://insideclimatenews.org/sites/default/files/styles/colorbox_full/public/1200px-Adler_jagt_WikimediaUserAWWE83.jpg?itok=HOCB9xLs", "The Bald Eagle is one of the most majestic and easily recognizable birds in the United States. As the national bird, it is seen on many national symbols. One of the two eagle species found in the country, it has powerful eyesight, powerful talons and a majestic wingspan.", "Dark brown body, thick yellow beak, wide eyes, white head, white tail, yellow feet", "Primarily fish, other small aquatic animals", "Areas near water bodies, such as lakes and bays", "Mexico, United States, Canada, Alaska"),
  new Bird("Barn Owl", "https://d1ia71hq4oe7pn.cloudfront.net/photo/63738041-480px.jpg", "The Barn Owl is amongst the commonest owls in the United States. It is known for its hissing cry, and unique features. It can be seen in many backyards, woods and other areas. ", "White, heart-shaped face, two small black eyes, tannish body, white spotted legs and belly", "Mice, rats and other small rodents", "Typically more wooded or mountainous areas", "Throughout North America"),
  new Bird('Western Tanager','http://www.birdsandblooms.com/wp-content/uploads/2013/09/Western-Tanager-DaveRyan.jpg','The Western Tanager is one of the most common tanagers in the Western United States. It is known for its distinctive yellow and orange plumage.', 'Black Body, white-black tail, yellow head with orange crown', 'Seeds, vegetation', 'Open, mountainous areas', 'Western United States'),
  new Bird('Peregrine Falcon', 'http://lindsaywildlife.org/wp-content/uploads/2016/01/PEFA-03-Paul-Hara-07.31.15.jpg', 'The Peregrine Falcon is a falcon which lives throughout North America. It is the fastest diver, able to reach speeds up to 275 mph, which allows it to catch prey in midair. It is probably the most well-known falcon in the United States.', 'Light grey front with black speckles, dark grey back, black hood, wide eyes, yellow bill', 'Medium sized birds, rodents', 'Mountainous areas and some wooded areas', 'Throughout North America'),
  new Bird('Red Tailed Hawk', 'https://cdn.audubon.org/cdn/farfuture/vMWdnUQNgZlz4Dk0WmI6eqGul9lfxriyNXLWXqOnNl8/mtime:1486671050/sites/default/files/styles/hero_cover_bird_page/public/Red-tailed Hawk v11-13-016_V.jpg?itok=qCs3x4Kr',"The Red Tailed Hawk is one of the United States' most well-known, as well as most common hawks. Its name is given due to its rufous tail. It has many different subspecies which can be seen throughout the country.",'Rufous Tail, tan body with dark brown and black feathers, sharp bill, wings mottled with tan, brown and white', 'Rodents such as mice and voles','Open, mountainous areas, as well as open grasslands', 'United States'),
  new Bird('American Kestrel', 'https://www.birdobserver.org/Portals/0/Assets/bo44-3/Image_021.jpg?ver=2016-05-30-103914-693', 'The American Kestrel is the smallest raptor in North America. It is known for its vibrant plumage, speed, and unique "ki-ki-ki" call. It is also sometimes known as the Sparrowhawk.', 'Small body, males have rufous back and breast, sky blue sides and faces striped with black and white', 'Small birds, frogs, rodents', 'Many habitats, such as grasslands, deserts and lakes', 'Throughout North America, from Central America to Northern Canada')
]

//Website variables
let submitted = false
let updated = false

//Server routes
app.get('/', (req, res) => {
  res.render('homepage')
})

app.get('/search', (req, res) => {
  res.render('homepage')
})

app.post('/search', (req, res) => {
  submitted = false
  updated = false
  let bird;
  let found = false
  res.cookie('og_search', req.body.name)
  let og_search = req.body.name
  for (let option of birds) {
    if (req.body.name.toLowerCase() == option.name.toLowerCase()) {
      bird = option
      res.cookie('bird_search', bird)
      found = true
      res.render('index', {name: bird.name, image: bird.img, description: bird.description, appearance: bird.appearance, diet: bird.diet, habitat: bird.habitat, range: bird.range})
      break
    }
  }
  if (found == false) {
    res.render('index', {not_there: og_search})
  }
})

app.post('/add', (req, res) => {
  res.render('add', {name: "", image: "", description: "", appearance: "", diet: "", habitat: "", range: ""})
  submitted = false
  updated = false
})

app.get('/add', (req, res) => {
  res.render('add', {name: "", image: "", description: "", appearance: "", diet: "", habitat: "", range: ""})
  submitted = false
  updated = false
})

app.get('/sub', (req, res) => {
  res.redirect('/add')
})

app.post('/sub', (req, res) => {
  let repeat = false
  let repeated_bird
  if (req.body.button == "Submit Bird") {
    for (let bird of birds) {
      if (bird.name.toLowerCase() == req.body.name.toLowerCase()) {
        repeat = true
        res.cookie('repeated_bird', bird)
         repeated_bird = bird
      }
    }
    if (repeat == false) {
      birds.push(new Bird(req.body.name, req.body.img, req.body.description, req.body.app, req.body.diet, req.body.habitat, req.body.range))
      let new_bird = birds[birds.length -1]
      res.cookie('new_bird', birds[birds.length -1])
      res.render('index', {name: new_bird.name, image: new_bird.img, range: new_bird.range, appearance: new_bird.appearance, diet: new_bird.diet, habitat: new_bird.habitat, description: new_bird.description})
      submitted = true

    } else if (repeat == true) {
      res.render('redo', {bird: repeated_bird.name})
    }

  } else if (req.body.button == "Preview Bird"){
    res.cookie('saved_bird', (new Bird(req.body.name, req.body.img, req.body.description, req.body.app, req.body.diet, req.body.habitat, req.body.range)))
    res.render('preview', {name: req.body.name, image: req.body.img, description: req.body.description, appearance: req.body.app, diet: req.body.diet, habitat: req.body.habitat, range: req.body.range})

  } else if (req.body.button == "View All Birds") {
    res.cookie('saved_bird', (new Bird(req.body.name, req.body.img, req.body.description, req.body.app, req.body.diet, req.body.habitat, req.body.range)))
    res.render('birds', {birds: birds})
  }
})

app.get('/edit', (req, res) => {
  res.redirect("/")
  updated = false
})

app.post('/edit', (req, res) => {
  let bird_cookie;
  if (submitted) {
    bird_cookie = req.cookies.new_bird
  } else if (updated) {
    bird_cookie = req.cookies.updated_bird
  } else {
    bird_cookie = req.cookies.bird_search
  }
  res.render('edit', {name: bird_cookie.name, image: bird_cookie.img, range: bird_cookie.range, app: bird_cookie.appearance, diet: bird_cookie.diet, habitat: bird_cookie.habitat, desc: bird_cookie.description})
})

app.get('/upd', (req, res) => {
  res.redirect('/edit')
})

app.post('/upd', (req, res) => {
  if (req.body.button == "Update Bird") {
    updated = true
    for (let bird of birds) {
      let bird_cookie = req.cookies.bird_search
      if (bird.name.toLowerCase() == bird_cookie.name.toLowerCase()) {
        for (let attr in bird) {
          bird[attr] = req.body[attr]
        }
        let new_bird = bird
        res.cookie('updated_bird', new_bird)
        res.render('index', {name: new_bird.name, image: new_bird.img, range: new_bird.range, appearance: new_bird.appearance, diet: new_bird.diet, habitat: new_bird.habitat, description: new_bird.description})
        break
      }
    }

  } else if (req.body.button == "Remove Bird") {
    for (let bird of birds) {
      if (bird.name == req.body.name) {
        birds.splice(birds.indexOf(bird), 1)
        res.render('homepage')
        break
      }
    }

  } else if (req.body.button == "Preview Bird") {
    res.cookie('upd_saved_bird', (new Bird(req.body.name, req.body.img, req.body.description, req.body.appearance, req.body.diet, req.body.habitat, req.body.range)))
    res.render('preview_upd', {name: req.body.name, image: req.body.img, description: req.body.description, appearance: req.body.appearance, diet: req.body.diet, habitat: req.body.habitat, range: req.body.range})

  } else if (req.body.button == "View All Birds") {
    res.cookie('upd_saved_bird', (new Bird(req.body.name, req.body.img, req.body.description, req.body.appearance, req.body.diet, req.body.habitat, req.body.range)))
    res.render('birds_upd', {birds: birds})
  }
})

app.get('/view', (req, res) => {
  res.redirect('/search')
})

app.post('/view', (req, res) => {
  if (req.body.button == "View All Birds") {
    res.render('birds_view', {birds: birds})

  } else if (req.body.button == "Add Bird With This Name") {
    let bird_search = req.cookies.og_search
    res.render('add', {name: bird_search, image: "", description: "", appearance: "", diet: "", habitat: "", range: ""})
  }
})

app.post('/leave', (req, res) => {
  res.render('add', {name: req.cookies.saved_bird.name, image: req.cookies.saved_bird.img, description: req.cookies.saved_bird.description, appearance: req.cookies.saved_bird.appearance, diet: req.cookies.saved_bird.diet, habitat: req.cookies.saved_bird.habitat, range: req.cookies.saved_bird.range})
})

app.get('/leave', (req, res) => {
  res.redirect('/all')
})

app.post('/leave_upd', (req, res) => {
  res.render('edit', {name: req.cookies.upd_saved_bird.name, image: req.cookies.upd_saved_bird.img, desc: req.cookies.upd_saved_bird.description, app: req.cookies.upd_saved_bird.appearance, diet: req.cookies.upd_saved_bird.diet, habitat: req.cookies.upd_saved_bird.habitat, range: req.cookies.upd_saved_bird.range})
})

app.get('/leave_upd', (req, res) => {
  res.redirect('/upd')
})

app.get('/leave_view', (req, res) => {
  res.redirect('/view')
})

app.post('/leave_view', (req, res) => {
  res.render('homepage')
})

app.get('/redo', (req, res) => {
  res.redirect('/search')
})

app.post('/redo', (req, res) => {
  if (req.body.button == "View All Birds") {
    res.render('birds_redo', {birds: birds})
  } else if (req.body.button == "Edit This Bird's Profile") {
    res.render('edit', {name: req.cookies.repeated_bird.name, image: req.cookies.repeated_bird.img, range: req.cookies.repeated_bird.range, app: req.cookies.repeated_bird.appearance, diet: req.cookies.repeated_bird.diet, habitat: req.cookies.repeated_bird.habitat, desc: req.cookies.repeated_bird.description})
  }
})

app.get('/leave_redo', (req, res) => {
  res.redirect('/redo')
})

app.post('/leave_redo', (req, res) => {
  res.render('redo')
})
//Runs server
let port = process.env.PORT || 3000
app.listen(port)
