// Sets up express server
const express = require('express')
const body_parser = require('body-parser')
const cookie_parser = require('cookie-parser')
const fs = require('fs')
const app = express()

app.set('views', __dirname + '/Views');
app.set('view engine', "pug")
app.use(body_parser.urlencoded({extended: false}))
app.use(cookie_parser())

//Bird database
class Bird {
  constructor(name, img, description, appearance, diet, habitat, range, gallery, size, hab_arr, col_arr) {
    this.name = name
    this.img = img
    this.description = description
    this.appearance = appearance
    this.diet = diet
    this.habitat = habitat
    this.range = range
    this.gallery = gallery
    this.size = size
    this.hab_arr = hab_arr
    this.col_arr = col_arr
  }
}

let birds = [
  new Bird("Great Horned Owl", "https://www.saczoo.org/wp-content/uploads/2016/12/Great-Horned-Owl-1.jpg", "The Great Horned Owl is the most abundant owl in North America. It is well known for its distinctive hooting sound, and bright yellow eyes. A nocturnal predator, it feeds on many different animals. It is able to turn its head 360°, making its hunting a lot easier.", "yellow eyes, brown, black and white body, two large ear tufts, orange cheeks", "Mice, Rabbits, Snakes, Small Birds, Turkeys, Geese", "Wooded Forests, Swamps, Mountains, Tundra", "Throughout North America", ["https://www.saczoo.org/wp-content/uploads/2016/12/Great-Horned-Owl-1.jpg"], "Raptor Size", ['Mountains', 'Urban/Suburban Areas', 'Forests', 'Tundra'], ['brown', 'grey', 'yellow', 'orange', 'white', 'brown']),
  new Bird("Common Merganser", "https://download.ams.birds.cornell.edu/api/v1/asset/24977881/medium.jpg", "The Common Merganser is a large freshwater duck seen around the world. Its most distinctive characteristic is its serrated beak, used for catching fish, which gives it the nickname 'sawbill'. Unlike many other ducks, it nests in tree burrows near the rivers which it fishes in.", "Sharp red beak, green head, white body with black black", "Small Fish, Crustaceans", "Freshwater Lakes", "North America, Europe, Asia", ["https://download.ams.birds.cornell.edu/api/v1/asset/24977881/medium.jpg"], "Waterfowl Size", ['Forests', 'Coastal Areas', 'Swamps and Marshes', 'Freshwater Bodies'], ['green', 'brown', 'red', 'white', 'black', 'red', 'green', 'black', 'white']),
  new Bird("Common Raven", "https://www.allaboutbirds.org/guide/assets/photo/63739541-480px.jpg", "The Common Raven is one of the most common and easily recognizable birds in the United States. It can be found everywhere, from crowded parking lots to the most secluded of wild areas. It is an extremely intelligent bird, as are all corvids.", "Dark grey and black body, thick beak, short legs", "Omnivorous bird, eats things like nuts, carrion and insects.", "Most places, including urban areas, mountainous regions and forests", "Across the Northern Hemisphere, in places like the US", ["https://d1ia71hq4oe7pn.cloudfront.net/photo/70579921-480px.jpg"], "Crow Size", ['Urban/Suburban Areas', 'Forests', 'Grasslands', 'Mountains', 'Deserts', 'Coastal Areas'], ['black', 'grey']),
  new Bird("White Crowned Sparrow", "https://d1ia71hq4oe7pn.cloudfront.net/photo/71542141-480px.jpg", "The White-Crowned Sparrow is a small sparrow species found in the United States. It is named for the white stripes on its head. A common backyard bird, it can be found throughout suburban areas as well as in the wild.", "Small yellow beak, black head with white stripes, grey breast, alternating dark/light brown back", "Primarily seeds, such as sunflower and safflower seeds", "Suburban neighborhoods, open forests, mountains", "Throughout North America", ["https://d1ia71hq4oe7pn.cloudfront.net/photo/71542141-480px.jpg"], "Songbird Size", ['Urban/Suburban Areas', 'Forests', 'Mountains', 'Grasslands'], ['white', 'brown', 'yellow', 'grey']),
  new Bird("Acorn Woodpecker", "https://19mvmv3yn2qc2bdb912o1t2n-wpengine.netdna-ssl.com/science/files/2017/04/Acorn_Woodpecker_on_black_oak_tree.jpg", "The Acorn Woodpecker is one of California's most common woodpeckers. Found almost exclusively in California, they are named for their primary food source, which they store in trees. They are well known for their loud 'waka-waka' call. ", "Black back, white breast, large black and white eyes, red head, sharp black beak", "Acorns and other tree nuts, some insects", "Mountains and forests", "Mostly California, parts of Western Arizona", ["https://19mvmv3yn2qc2bdb912o1t2n-wpengine.netdna-ssl.com/science/files/2017/04/Acorn_Woodpecker_on_black_oak_tree.jpg"], "Songbird Size", ['Forests', 'Mountains'], ['black', 'white', 'red', 'grey', 'brown']),
  new Bird("Dark Eyed Junco", "https://nationalzoo.si.edu/scbi/migratorybirds/featured_photo/images/bigpic/deju181.jpg", "The Dark-Eyed Junco is a common subspecies of the sparrow. It is quite small, creating a small 'chip' sound which can sometimes barely be heard. It can be seen in both the wild and suburban areas.", "short pinkish-yellow beak, black head, dark rufous back, paleish pink breast, long tail", "Seeds, small insects", "Temperate regions such as mountains and forests, suburban areas", "Across North America", ["https://nationalzoo.si.edu/scbi/migratorybirds/featured_photo/images/bigpic/deju181.jpg"], "Songbird Size", ['Urban/Suburban Areas', 'Forests', 'Mountains'], ['brown', 'red', 'black', 'white', 'grey']),
  new Bird("Canada Goose", "https://download.ams.birds.cornell.edu/api/v1/asset/51027681/large", "The Canada Goose is a large goose found throughout the United States and Canada. They are found throughout both wild areas and urban places like parks. Due to their large populations, they are considered pests. These geese are known for their honking cry.", "Large body, white and black face, black neck and legs, dark brown and coffee-colored breast, back and wings", "Primarily vegetation, sometimes small insects", "Open areas with vegetation such as near lakes", "United States and Canada", ["https://download.ams.birds.cornell.edu/api/v1/asset/51027681/large"], "Waterfowl Size", ['Coastal Areas', 'Urban/Suburban Areas', 'Freshwater Bodies'], ['brown', 'black', 'white', 'grey']),
  new Bird("Northern Cardinal", "https://www.pennington.com/-/media/images/pennington-na/us/blog/wild-bird/northern-cardinals/northern-cardinal-og.jpg", "The Northern Cardinal is a songbird which lives on the East Coast of the United States. It can also be found in Eastern Canada, and even throughout the tropics and in parts of Hawai'i. It is well-known for its bright red color. They can be seen in both suburban neighborhoods near bird feeders as well as in the wild.", "Bright red body, black face, thick red bill, red crest", "Seeds, small insects", "Mountains, forests, suburban areas", "East Coast, Eastern Canada, Central America, Hawai'i", ["https://www.pennington.com/-/media/images/pennington-na/us/blog/wild-bird/northern-cardinals/northern-cardinal-og.jpg"], "Songbird Size", ['Urban/Suburban Areas', 'Mountains', 'Forests', 'Grasslands'], ['red', 'black', 'brown', 'grey', 'white']),
  new Bird("Bald Eagle", "https://insideclimatenews.org/sites/default/files/styles/colorbox_full/public/1200px-Adler_jagt_WikimediaUserAWWE83.jpg?itok=HOCB9xLs", "The Bald Eagle is one of the most majestic and easily recognizable birds in the United States. As the national bird, it is seen on many national symbols. One of the two eagle species found in the country, it has powerful eyesight, powerful talons and a majestic wingspan.", "Dark brown body, thick yellow beak, wide eyes, white head, white tail, yellow feet", "Primarily fish, other small aquatic animals", "Areas near water bodies, such as lakes and bays", "Mexico, United States, Canada, Alaska", ["https://insideclimatenews.org/sites/default/files/styles/colorbox_full/public/1200px-Adler_jagt_WikimediaUserAWWE83.jpg?itok=HOCB9xLs"], "Raptor Size", ['Mountains', 'Coastal Areas'], ['brown', 'white', 'yellow', 'grey', 'black', 'yellow', 'brown', 'white']),
  new Bird("Barn Owl", "https://d1ia71hq4oe7pn.cloudfront.net/photo/63738041-480px.jpg", "The Barn Owl is amongst the commonest owls in the United States. It is known for its hissing cry, and unique features. It can be seen in many backyards, woods and other areas. ", "White, heart-shaped face, two small black eyes, tannish body, white spotted legs and belly", "Mice, rats and other small rodents", "Typically more wooded or mountainous areas", "Throughout North America", ["https://d1ia71hq4oe7pn.cloudfront.net/photo/63738041-480px.jpg"], "Raptor Size", ['Mountains', 'Grasslands', 'Forests'], ['brown', 'white', 'grey', 'black']),
  new Bird("Western Tanager", "http://www.birdsandblooms.com/wp-content/uploads/2013/09/Western-Tanager-DaveRyan.jpg", "The Western Tanager is one of the most common tanagers in the Western United States. It is known for its distinctive yellow and orange plumage.", "Black Body, white-black tail, yellow head with orange crown", "Seeds, vegetation", "Open, mountainous areas", "Western United States", ["http://www.birdsandblooms.com/wp-content/uploads/2013/09/Western-Tanager-DaveRyan.jpg"], "Songbird Size", ['Mountains', 'Urban/Suburban Areas', 'Grasslands'], ['orange', 'yellow', 'red', 'black', 'white']),
  new Bird("Peregrine Falcon", "http://lindsaywildlife.org/wp-content/uploads/2016/01/PEFA-03-Paul-Hara-07.31.15.jpg", "The Peregrine Falcon is a falcon which lives throughout North America. It is the fastest diver, able to reach speeds up to 275 mph, which allows it to catch prey in midair. It is probably the most well-known falcon in the United States.", "Light grey front with black speckles, dark grey back, black hood, wide eyes, yellow bill", "Medium sized birds, rodents", "Mountainous areas and some wooded areas", "Throughout North America", ["http://lindsaywildlife.org/wp-content/uploads/2016/01/PEFA-03-Paul-Hara-07.31.15.jpg"], "Raptor Size", ['Mountains', 'Grasslands'], ['grey', 'black', 'white', 'yellow', 'brown']),
  new Bird("Red Tailed Hawk", "https://cdn.audubon.org/cdn/farfuture/vMWdnUQNgZlz4Dk0WmI6eqGul9lfxriyNXLWXqOnNl8/mtime:1486671050/sites/default/files/styles/hero_cover_bird_page/public/Red-tailed Hawk v11-13-016_V.jpg?itok=qCs3x4Kr", "The Red Tailed Hawk is one of the United States' most well-known, as well as most common hawks. Its name is given due to its rufous tail. It has many different subspecies which can be seen throughout the country.", "Rufous Tail, tan body with dark brown and black feathers, sharp bill, wings mottled with tan, brown and white", "Rodents such as mice and voles", "Open, mountainous areas, as well as open grasslands", "United States", ["https://cdn.audubon.org/cdn/farfuture/vMWdnUQNgZlz4Dk0WmI6eqGul9lfxriyNXLWXqOnNl8/mtime:1486671050/sites/default/files/styles/hero_cover_bird_page/public/Red-tailed Hawk v11-13-016_V.jpg?itok=qCs3x4Kr"], "Raptor Size", ['Mountains', 'Grasslands', 'Urban/Suburban Areas'], ['red', 'brown', 'white', 'grey']),
  new Bird("American Kestrel", "https://www.birdobserver.org/Portals/0/Assets/bo44-3/Image_021.jpg?ver=2016-05-30-103914-693", "The American Kestrel is the smallest raptor in North America. It is known for its vibrant plumage, speed, and unique 'ki-ki-ki' call. Considered part of the falcon family, it is also sometimes known as the Sparrowhawk.", "Small body, males have rufous back and breast, sky blue sides and faces striped with black and white", "Small birds, frogs, rodents", "Many habitats, such as grasslands, deserts and lakes", "Throughout North America, especially the US", ["https://www.birdobserver.org/Portals/0/Assets/bo44-3/Image_021.jpg?ver=2016-05-30-103914-693"], "Crow Size", ['Urban/Suburban Areas', 'Grasslands', 'Forests', 'Mountains'], ['blue', 'orange', 'white', 'grey', 'black', 'blue', 'black', 'white']),
  new Bird("Lesser Goldfinch", "https://d1ia71hq4oe7pn.cloudfront.net/photo/67272491-480px.jpg", "The Lesser Goldfinch is the smallest goldfinch in North America, found primarily in the Western United States. Unlike its eastern relative, the American Goldfinch, its body has a duller yellow color.", "Small body, lemon yellow breast, dull grey-yellow back, black crown and tail", "Seeds such as sunflower seeds", "Areas with trees, such as backyards and woods", "United States", ["https://d1ia71hq4oe7pn.cloudfront.net/photo/67272491-480px.jpg"], "Songbird Size", ['Urban/Suburban Areas', 'Mountains', 'Forests', 'Grasslands', 'Tundra'], ['yellow', 'green', 'grey', 'black']),
  new Bird("Snail Kite", "https://d3n0rgqlxm83jq.cloudfront.net/wp-content/uploads/Snail-Kite.jpg", "The Snail Kite is one of the kites found in the US, found exclusively in Florida. It has a uniquely colored body and a singular diet which gives it its name. It can be seen occasionally near swamps and lakes in places like the Everglades.", "Grey/purple body, red eyes, orange feet, yellow hooked bill", "Snails", "Near swamps and lakes", "Florida", ["https://d3n0rgqlxm83jq.cloudfront.net/wp-content/uploads/Snail-Kite.jpg"], "Raptor Size", ['Swamps and Marshes', 'Freshwater Bodies'], ['purple', 'grey', 'brown', 'yellow', 'black', 'white']),
  new Bird("American Robin", "https://upload.wikimedia.org/wikipedia/commons/b/b8/Turdus-migratorius-002.jpg", "The American Robin is one of the United States' most easily recognizable birds. It is known for its orange-red breast, giving it the nickname 'robin redbreast', and it has become commonly associated with Spring. ", "Rufous breast, yellow bill, wide eyes, greyish-black back and face", "Small insects, invertebrates like earthworms", "Suburban areas, open woods, grasslands", "United States, parts of Canada", ["https://upload.wikimedia.org/wikipedia/commons/b/b8/Turdus-migratorius-002.jpg"], "Songbird Size", ['Urban/Suburban Areas', 'Mountains', 'Forests', 'Grasslands'], ['red', 'black', 'grey', 'brown', 'white']),
  new Bird("Mallard", "https://kids.nationalgeographic.com/content/dam/kids/photos/animals/Birds/H-P/mallard-male-swimming.adapt.945.1.jpg", "The Mallard is one of the United States' most commonly seen ducks. It can be found in both wild areas and public areas like parks, and is well known for its bright green head. A dabbling duck, it tends to be found near freshwater bodies.", "Green head, orange webbed feet, brown body streaked with tan", "Small Fish, Crustaceans, Aquatic Vegetation", "Freshwater lakes, streams and other water bodies", "Throughout North America", ["https://kids.nationalgeographic.com/content/dam/kids/photos/animals/Birds/H-P/mallard-male-swimming.adapt.945.1.jpg"], "Waterfowl Size", ['Urban/Suburban Areas', 'Coastal Areas', 'Swamps and Marshes', 'Freshwater Bodies'], ['orange', 'green', 'brown', 'orange', 'green', 'brown'])
]

//Website variables
let submitted = false
let updated = false
let color;
let color2;
let size;
let hab_results;

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
  let results = []
  res.cookie('og_search', req.body.name)
  let og_search = req.body.name
  let regOp = new RegExp(req.body.name.toLowerCase())

  for (let option of birds) {
    if (regOp.test(option.name.toLowerCase()) && req.body.name.length >= 3) {
      bird = option
      res.cookie('bird_search', bird)
      found = true
      break
    }
  }

  if (og_search.length > 3) {
    for (let option of birds) {
      for (let attr in option) {
        if (typeof(option[attr]) == "string" && attr != "img") {
          if (regOp.test(option[attr].toLowerCase()) && req.cookies.bird_search[attr].length > 3) {
            results.push(option)
          }
        }
      }
    }

    let counter = 0
    for (let result of results) {
      if (results.indexOf(result) != counter) {
        results.splice(counter, 1)
      }
      counter += 1
    }

    if (results.length > 0) {
      res.render('list', {identify: false, query: `"${og_search}"`, results})

    } else {
      res.render('index', {not_there: og_search})
    }

  } else {
    res.render('index', {too_short: og_search})
  }

})

app.post('/add', (req, res) => {
  res.render('add', {name: "", image: "", description: "", appearance: "", diet: "", habitat: "", range: "", bird_size: "Songbird Size", sizes: ['Crow Size', 'Raptor Size', 'Waterfowl Size', 'Turkey Size or Larger']})
  submitted = false
  updated = false
})

app.get('/add', (req, res) => {
  res.render('add', {name: "", image: "", description: "", appearance: "", diet: "", habitat: "", range: "", bird_size: "Songbird Size", sizes: ['Crow Size', 'Raptor Size', 'Waterfowl Size', 'Turkey Size or Larger']})
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
      let size = req.body.size
      let habitats = ['Urban/Suburban Areas', 'Grasslands', 'Tundra', 'Forests', 'Mountains', 'Coastal Areas', 'Deserts', 'Swamps and Marshes', 'Freshwater Bodies']
      let colors = ['red', 'orange', 'yellow', 'green', 'blue', 'black', 'brown', 'white', 'grey']
      let hab_arr = []
      let col_arr = []
      for (let habitat of habitats) {
        if (req.body[habitat] == 'on') {
          hab_arr.push(habitat)
        }
      }

      for (let color of colors) {
        if (req.body.app.toLowerCase().includes(color)) {
          col_arr.push(color)
        }
      }
      birds.push(new Bird(req.body.name, req.body.img, req.body.description, req.body.app, req.body.diet, req.body.habitat, req.body.range, [req.body.img], size, hab_arr, col_arr))
      let new_bird = birds[birds.length -1]
      res.cookie('new_bird', birds[birds.length -1])
      res.cookie('bird_search', birds[birds.length-1])
      res.render('index', {name: new_bird.name, image: new_bird.img, range: new_bird.range, appearance: new_bird.appearance, diet: new_bird.diet, habitat: new_bird.habitat, description: new_bird.description})
      submitted = true
      let bird_string = "let birds = [\n";
      for (let bird of birds) {
        hab_string = ""
        col_string = ""
        bird_string += `  new Bird("${bird.name}", "${bird.img}", "${bird.description}", "${bird.appearance}", "${bird.diet}", "${bird.habitat}", "${bird.range}", ["${bird.img}"], "${bird.size}", [`
          for (let hab of bird.hab_arr) {
            hab_string += `'${hab}', `
          }

          for (let i = 0; i < hab_string.length-2; i += 1) {
            bird_string += hab_string[i]
          }

          bird_string += "], ["
          for (let col of bird.col_arr) {
            col_string += `'${col}', `
          }

          for (let i = 0; i < col_string.length-2; i += 1) {
            bird_string += col_string[i]
          }

          bird_string += "]), \n"
      }

      bird_string = bird_string.slice(0, bird_string.length-3) + "\n]"
      fs.writeFile('birds.txt', bird_string, (err) => {
        if (err) throw err;
      })

    } else if (repeat == true) {
      res.render('redo', {bird: repeated_bird.name})
    }

  } else if (req.body.button == "Preview Bird"){
    let hab_arr = []
    let habitats = ['Urban/Suburban Areas', 'Grasslands', 'Tundra', 'Forests', 'Mountains', 'Coastal Areas', 'Deserts', 'Swamps and Marshes', 'Freshwater Bodies']
    for (let habitat of habitats) {
      if (req.body[habitat] == 'on') {
        hab_arr.push(habitat)
      }
    }
    res.cookie('saved_bird', (new Bird(req.body.name, req.body.img, req.body.description, req.body.app, req.body.diet, req.body.habitat, req.body.range, [req.body.img], req.body.size, hab_arr, [])))
    res.render('preview', {name: req.body.name, image: req.body.img, description: req.body.description, appearance: req.body.app, diet: req.body.diet, habitat: req.body.habitat, range: req.body.range})

  } else if (req.body.button == "View All Birds") {
    hab_arr = []
    habitats = ['Urban/Suburban Areas', 'Grasslands', 'Tundra', 'Forests', 'Mountains', 'Coastal Areas', 'Deserts', 'Swamps and Marshes', 'Freshwater Bodies']
    for (let habitat of habitats) {
      if (req.body[habitat] == 'on') {
        hab_arr.push(habitat)
      }
    }

    res.cookie('saved_bird', (new Bird(req.body.name, req.body.img, req.body.description, req.body.app, req.body.diet, req.body.habitat, req.body.range, [req.body.img], req.body.size, hab_arr, [])))
    res.render('birds', {birds: birds})
  }
})

app.get('/edit', (req, res) => {
  res.redirect("/")
  updated = false
})

app.post('/edit', (req, res) => {
  let bird_cookie;
  let habitats = ['Urban/Suburban Areas', 'Grasslands', 'Tundra', 'Forests', 'Mountains', 'Coastal Areas', 'Deserts', 'Swamps and Marshes', 'Freshwater Bodies']
  if (submitted) {
    bird_cookie = req.cookies.new_bird
  } else if (updated) {
    bird_cookie = req.cookies.updated_bird
  } else {
    bird_cookie = req.cookies.bird_search
  }

  let sizes = ['Songbird Size', 'Crow Size', 'Raptor Size', 'Waterfowl Size', 'Turkey Size or Larger']
  res.render('edit', {name: bird_cookie.name, image: bird_cookie.img, range: bird_cookie.range, app: bird_cookie.appearance, diet: bird_cookie.diet, habitat: bird_cookie.habitat, desc: bird_cookie.description, bird_size: bird_cookie.size, sizes, on: bird_cookie.hab_arr})
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
          if (attr != "gallery" && attr != "hab_arr" && attr != "col_arr") {
            bird[attr] = req.body[attr]
          } else if (attr == 'gallery') {
            bird.gallery = [req.body.img]

          } else if (attr == 'hab_arr') {
            let habitats = ['Urban/Suburban Areas', 'Grasslands', 'Tundra', 'Forests', 'Mountains', 'Coastal Areas', 'Deserts', 'Swamps and Marshes', 'Freshwater Bodies']
            bird.hab_arr = []
            for (let habitat of habitats) {
              if (req.body[habitat] == 'on') {
                bird.hab_arr.push(habitat)
              }
            }

          } else if (attr == 'col_arr') {
            let colors = ['red', 'orange', 'yellow', 'green', 'blue', 'black', 'brown', 'white', 'grey']
            for (let color of colors) {
              if (req.body.appearance.toLowerCase().includes(color)) {
                bird.col_arr.push(color)
              }
            }
          }
        }
        let new_bird = bird
        res.cookie('updated_bird', new_bird)
        res.cookie('bird_search', new_bird)
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
    let hab_arr = []
    let habitats = ['Urban/Suburban Areas', 'Grasslands', 'Tundra', 'Forests', 'Mountains', 'Coastal Areas', 'Deserts', 'Swamps and Marshes', 'Freshwater Bodies']
    for (let habitat of habitats) {
      if (req.body[habitat] == 'on') {
        hab_arr.push(habitat)
      }
    }
    res.cookie('upd_saved_bird', (new Bird(req.body.name, req.body.img, req.body.description, req.body.appearance, req.body.diet, req.body.habitat, req.body.range, [req.body.img], req.body.size, hab_arr, [])))
    res.render('preview_upd', {name: req.body.name, image: req.body.img, description: req.body.description, appearance: req.body.appearance, diet: req.body.diet, habitat: req.body.habitat, range: req.body.range})

  } else if (req.body.button == "View All Birds") {
    res.cookie('upd_saved_bird', (new Bird(req.body.name, req.body.img, req.body.description, req.body.appearance, req.body.diet, req.body.habitat, req.body.range, [req.body.img])))
    res.render('birds_upd', {birds: birds})
  }

  let bird_string = "let birds = [\n";
  for (let bird of birds) {
    hab_string = ""
    col_string = ""
    bird_string += `  new Bird("${bird.name}", "${bird.img}", "${bird.description}", "${bird.appearance}", "${bird.diet}", "${bird.habitat}", "${bird.range}", ["${bird.img}"], "${bird.size}", [`
      for (let hab of bird.hab_arr) {
        hab_string += `'${hab}', `
      }

      for (let i = 0; i < hab_string.length-2; i += 1) {
        bird_string += hab_string[i]
      }

      bird_string += "], ["
      for (let col of bird.col_arr) {
        col_string += `'${col}', `
      }

      for (let i = 0; i < col_string.length-2; i += 1) {
        bird_string += col_string[i]
      }

      bird_string += "]), \n"
  }

  bird_string = bird_string.slice(0, bird_string.length-3) + "\n]"
  fs.writeFile('birds.txt', bird_string, (err) => {
    if (err) throw err;
  })
})

app.get('/view', (req, res) => {
  res.redirect('/search')
})

app.post('/view', (req, res) => {
  if (req.body.button == "View All Birds") {
    res.render('birds_view', {birds: birds})

  } else if (req.body.button == "Add Bird With This Name") {
    let bird_search = req.cookies.og_search
    res.render('add', {name: bird_search, image: "", description: "", appearance: "", diet: "", habitat: "", range: "", sizes: ['Songbird Size', 'Crow Size', 'Raptor Size', 'Waterfowl Size', 'Turkey Size or Larger']})
  }
})

app.post('/leave', (req, res) => {
  let sizes = ['Songbird Size', 'Crow Size', 'Raptor Size', 'Waterfowl Size', 'Turkey Size or Larger']
  res.render('add', {name: req.cookies.saved_bird.name, image: req.cookies.saved_bird.img, description: req.cookies.saved_bird.description, appearance: req.cookies.saved_bird.appearance, diet: req.cookies.saved_bird.diet, habitat: req.cookies.saved_bird.habitat, range: req.cookies.saved_bird.range, bird_size: req.cookies.saved_bird.size, sizes, on: req.cookies.saved_bird.hab_arr})
})

app.get('/leave', (req, res) => {
  res.redirect('/all')
})

app.post('/leave_upd', (req, res) => {
  let sizes = ['Songbird Size', 'Crow Size', 'Raptor Size', 'Waterfowl Size', 'Turkey Size or Larger']
  res.render('edit', {name: req.cookies.upd_saved_bird.name, image: req.cookies.upd_saved_bird.img, desc: req.cookies.upd_saved_bird.description, app: req.cookies.upd_saved_bird.appearance, diet: req.cookies.upd_saved_bird.diet, habitat: req.cookies.upd_saved_bird.habitat, range: req.cookies.upd_saved_bird.range, bird_size: req.cookies.upd_saved_bird.size, sizes, on: req.cookies.upd_saved_bird.hab_arr})
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
    let sizes = ['Songbird Size', 'Crow Size', 'Raptor Size', 'Waterfowl Size', 'Turkey Size or Larger']
    res.render('edit', {name: req.cookies.repeated_bird.name, image: req.cookies.repeated_bird.img, range: req.cookies.repeated_bird.range, app: req.cookies.repeated_bird.appearance, diet: req.cookies.repeated_bird.diet, habitat: req.cookies.repeated_bird.habitat, desc: req.cookies.repeated_bird.description})
  }
})

app.get('/leave_redo', (req, res) => {
  res.redirect('/redo')
})

app.post('/leave_redo', (req, res) => {
  res.render('redo')
})

app.get('/gallery', (req, res) => {
  res.redirect("/search")
})

app.post('/gallery', (req, res) => {
  let bird = req.cookies.bird_search
  for (let option of birds) {
    if (option.name.toLowerCase() == bird.name.toLowerCase()) {
      for (let attr in bird) {
        bird[attr] = option[attr]
      }
      break
    }
  }
  res.render('gallery', {images: bird.gallery, msg: "Which image? (Type image number)"})
})

app.get('/leave_gall', (req, res) => {
  res.redirect('/gallery')
})

app.post('/leave_gall', (req, res) => {
  let bird = req.cookies.bird_search
  res.render('index', {name: bird.name, image: bird.img, description: bird.description, appearance: bird.appearance, diet: bird.diet, habitat: bird.habitat, range: bird.range})
})

app.get('/add_gall', (req, res) => {
  res.redirect('/gallery')
})

app.post('/add_gall', (req, res) => {
  if (req.body.new_image_input == '') {
    res.redirect('/gallery')

  } else {
    let bird = req.cookies.bird_search
    let img_name = req.body.new_image_input
    req.body.new_image_input = ''
    for (let option of birds) {
      if (option.name.toLowerCase() == bird.name.toLowerCase()) {
        for (let attr in bird) {
          bird[attr] = option[attr]
        }
        break
      }
    }

    let display_bird;
    bird.gallery.push(img_name)
    console.dir(bird.gallery)
    console.dir(req.body.new_image_input)
    for (let option of birds) {
      if (option.name.toLowerCase() == bird.name.toLowerCase()) {
        for (let attr in option) {
          option[attr] = bird[attr]
        }
        display_bird = option;
        break
      }
    }
    let bird_string = "let birds = [\n";
    for (let bird of birds) {
      hab_string = ""
      col_string = ""
      bird_string += `  new Bird("${bird.name}", "${bird.img}", "${bird.description}", "${bird.appearance}", "${bird.diet}", "${bird.habitat}", "${bird.range}", [`

      for (let image of bird.gallery) {
        bird_string += `"${image}", `
      }

      bird_string += `], "${bird.size}", [`

        for (let hab of bird.hab_arr) {
          hab_string += `'${hab}', `
        }

        for (let i = 0; i < hab_string.length-2; i += 1) {
          bird_string += hab_string[i]
        }

        bird_string += "], ["
        for (let col of bird.col_arr) {
          col_string += `'${col}', `
        }

        for (let i = 0; i < col_string.length-2; i += 1) {
          bird_string += col_string[i]
        }

        bird_string += "]), \n"
    }

    bird_string = bird_string.slice(0, bird_string.length-3) + "\n]"
    fs.writeFile('birds.txt', bird_string, (err) => {
      if (err) throw err;
    })
    res.render('gallery', {images: display_bird.gallery, msg: "Which image? (Type image number)"})
  }
})

app.get('/del_gall', (req, res) => {
  res.redirect('/gallery')
})

app.post('/del_gall', (req, res) => {
  let bird = req.cookies.bird_search
  let index = req.body.deleted_index

  for (let option of birds) {
    if (option.name.toLowerCase() == bird.name.toLowerCase()) {
      for (let attr in bird) {
        bird[attr] = option[attr]
      }
      break
    }
  }

  if (isNaN(index)) {
    res.render('gallery', {images: bird.gallery, msg: "Not an integer, try again"})

  } else {
    index = parseInt(index)
    let bird = req.cookies.bird_search
    if (index > bird.gallery.length) {
      res.render('gallery', {images: bird.gallery, msg: "Number is too large, try again"})

    } else if (index == 1) {
      res.render('gallery', {images: bird.gallery, msg: "Cannot delete original image, try again"})

    } else if (index < 1) {
      res.render('gallery', {images: bird.gallery, msg: "Number is below 1, try again"})

    } else {
      let display_bird;
      bird.gallery.splice(index - 1, 1)
      for (let option of birds) {
        if (option.name.toLowerCase() == bird.name.toLowerCase()) {
          for (let attr in option) {
            option[attr] = bird[attr]
          }
          display_bird = option;
          break
        }
      }
      res.render('gallery', {images: display_bird.gallery, msg: "Which image? (Type image number)"})
    }
  }
})

app.get('/identify', (req, res) => {
  res.render('identify')
})

let identified_results = []

app.post('/identify', (req, res) => {
  identified_results = []
  for (let bird of birds) {
    identified_results.push(bird)
  }
  res.render('identify')
})

app.get('/primary', (req, res) => {
  res.redirect('/identify')
})

app.post('/primary', (req, res) => {
  color = req.body.color
  let remove = []
  for (let bird of identified_results) {
    let found_color = false;
    if (bird.col_arr.indexOf(color.toLowerCase()) == -1 && color != '') {
      found_color = true;
      remove.push(bird)
    }
  }

  for (let bird of remove) {
    identified_results.splice(identified_results.indexOf(bird), 1)
  }

  res.render('identify')
})

app.get('/secondary', (req, res) => {
  res.redirect('/identify')
})

app.post('/secondary', (req, res) => {
  color2 = req.body.color
  let remove = []
  for (let bird of identified_results) {
    let found_color = false;
    if (bird.col_arr.indexOf(color2.toLowerCase()) == -1 && color2 != '') {
      found_color = true;
      remove.push(bird)
    }
  }

  for (let bird of remove) {
    identified_results.splice(identified_results.indexOf(bird), 1)
  }

  res.render('identify')
})

app.get('/size', (req, res) => {
  res.redirect('/identify')
})

app.post('/size', (req, res) => {
  size = req.body.size
  remove = []
  for (let bird of identified_results) {
    if (bird.size != size && bird.size != '') {
      remove.push(bird)
    }
  }
  for (let bird of remove) {
    identified_results.splice(identified_results.indexOf(bird), 1)
  }
  res.render('identify')
})

app.get('/habitat', (req, res) => {
  res.redirect('/identify')
})

app.post('/habitat', (req, res) => {
  let habitats = ['Urban/Suburban Areas', 'Grasslands', 'Tundra', 'Forests', 'Mountains', 'Coastal Areas', 'Deserts', 'Swamps and Marshes', 'Freshwater Bodies']
  let remove = []
  hab_results = []
  let stopped = false;

  for (let habitat of habitats) {
    if (req.body[habitat] == "on") {
      hab_results.push(habitat)
    }
  }

  for (let bird of identified_results) {
    for (let option of hab_results) {
      if (bird.hab_arr.indexOf(option) == -1) {
        remove.push(bird)
      }
    }
  }

  for (let bird of remove) {
    identified_results.splice(identified_results.indexOf(bird), 1)
  }
  res.render('identify')
})

app.get('/submit', (req, res) => {
  res.redirect('/identify')
})

app.post('/submit', (req, res) => {
  if (identified_results.length == 0) {
    res.render('list', {identify: true, query: "the data you provided", empty: true, results: []})
  } else {
    res.render('list', {identify: true, query: "the data you provided", results: identified_results})
  }
})

app.get('/clear', (req, res) => {
  res.redirect('/identify')
})

app.post('/clear', (req, res) => {
  while (identified_results.length > 0) {
    identified_results.pop()
  }

  for (let bird of birds) {
    identified_results.push(bird)
  }

  while (hab_results.length > 0) {
    hab_results.pop()
  }

  color = "";
  color2 = "";
  size = "";

  res.render('identify');
})

app.get('/view_bird', (req, res) => {
  res.redirect('/search')
})

app.post('/view_bird', (req, res) => {
  let display_bird;
  for (let bird of birds) {
    if (bird.name == req.body.bird_name) {
      display_bird = bird
      res.cookie('bird_search', display_bird)
      break
    }
  }
  res.render('index', {name: display_bird.name, image: display_bird.img, description: display_bird.description, appearance: display_bird.appearance, diet: display_bird.diet, habitat: display_bird.habitat, range: display_bird.range})
})

app.get('/leave_identify', (req, res) => {
  res.render('identify')
})

app.post('/leave_identify', (req, res) => {
  res.render('identify')
})

//Runs server
let port = process.env.PORT || 3000
app.listen(port)
