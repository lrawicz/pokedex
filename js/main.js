
let PkName = document.getElementById("PkName");
let screen01 = document.getElementById("screen01");
let showPokemon = document.getElementById("showPokemon");
let screen02 = document.getElementById("screen02");
let type01 = document.getElementById("type01");
let type02 = document.getElementById("type02");
let spriteFront = document.getElementById("spriteFront");
let spriteBack = document.getElementById("spriteBack");
let evoImg = document.getElementById("evoImg");
let loading = document.getElementById("loading");
let types = ["normal","fighting","flying","poison","ground","rock","bug","","","","","","","","","","",]
let botonera = document.getElementsByClassName("botoneraFront")
let botoneraBack = document.getElementById("botoneraBack")
let arrows = document.getElementsByClassName("arrow")

let botonera01 = document.getElementById("botonera01")
let botonera02 = document.getElementById("botonera02")
let botonera03 = document.getElementById("botonera03")
let botonera04 = document.getElementById("botonera04")
let botonera05 = document.getElementById("botonera05")
let botonera06 = document.getElementById("botonera06")
let botonera07 = document.getElementById("botonera07")
let botonera08 = document.getElementById("botonera08")
let botonera09 = document.getElementById("botonera09")
let botonera10 = document.getElementById("botonera10")


let pokemon ="";	
getPokemonData = async(nameOrId)=> {
	URL= "https://pokeapi.co/api/v2/";
	nameID= isNaN(nameOrId) ? nameOrId: parseInt(nameOrId);
	let promise1 = await fetch(URL + "pokemon/" + nameID);
	let promise2 = await fetch( URL + "pokemon-species/"+ nameID);
	let PK = await promise1.json();
	let PKSpecie = await promise2.json();
	getIdFromUrl = (obj) => {return obj.substr(42,obj.length-43)};

	if( promise1.status !== 200 && promise2.status !== 200){
	   		console.log('Missingo');
	   		return;
	}else{
		let promise3 = await fetch(PKSpecie["evolution_chain"]["url"]);
		let evolution_chain = await promise3.json();
		pokemon ={}	
		let promise4 = await fetch(URL + "type/" + PK["types"][0]["type"]["name"]);
		let promise5 = PK["types"].length == 1? null:await fetch(URL + "type/" + PK["types"][1]["type"]["name"]);
		let JSONtype01 = await promise4.json();
		let JSONtype02 = promise5 === null? null:await promise5.json();
		let base = {}
		for (var i = 1; i < 19; i++) {
			base[i]="1"
		}
		let damage_to ={};
		let damage_from = {};
		
		for (let index = 1; index < types.length+1; index++) {
			damage_to[index] = 1;
			damage_from[index] = 1;
		}
		calcDamageRelation =(damage_relation={}, toFrom="to", base )=>{
			damage_relation[`double_damage_${toFrom}`].map((x)=>{
				tempId = x["url"].substr(-this.length + 31).replace("/", "")
				base[tempId] = base[tempId] * 2
			})
			damage_relation[`half_damage_${toFrom}`].map((x) => {
				tempId = x["url"].substr(-this.length + 31).replace("/", "")
				base[tempId] = base[tempId] * 1/2
			})
			damage_relation[`no_damage_${toFrom}`].map((x) => {
				tempId = x["url"].substr(-this.length + 31).replace("/", "")
				base[tempId] = base[tempId] * 0
			})
			return base
		}
		damage_to = calcDamageRelation(JSONtype01["damage_relations"]
		, "to", damage_from)
		damage_from = calcDamageRelation(JSONtype01["damage_relations"]
		, "from", damage_from)
		if (JSONtype02 !== null){
			damage_to = calcDamageRelation(JSONtype02["damage_relations"]
			, "to", damage_from)
			damage_from = calcDamageRelation(JSONtype02["damage_relations"], 
			"from", damage_from)
		}
		console.log(damage_to);
		
		
		let first= getIdFromUrl(evolution_chain["chain"]["species"]["url"]);
		let secondRAW;
		let thirdRAW;
		let total = {};
		secondRAW = evolution_chain["chain"]["evolves_to"];
		
		for (var i = 0; i < secondRAW.length; i++) {
			SecondId = getIdFromUrl(secondRAW[i]["species"]["url"])
			thirdRAW = secondRAW[i]["evolves_to"]
			arrEvolve =[];
			for (var n = 0; n < thirdRAW.length; n++) {
				ThirdId = getIdFromUrl(thirdRAW[n]["species"]["url"])
				arrEvolve.push(ThirdId);
			}
			total[SecondId] =arrEvolve
		}
		let evolutionChain={}
		evolutionChain[first] = total;

		let evo02 = Object.keys(evolutionChain[first])
		let nextEvolution;
		if (first == PK["id"]){
			stage = 1;
			nextEvolution = evo02;
		} else if (evo02.includes(PK["id"])){
			stage = 2;
			nextEvolution = Object.keys(evolutionChain[first][PK["id"]])
		} else {
			stage = 3;
			nextEvolution = null
		}

		
		pokemon["id"] = PK["id"];
		pokemon["name"] = PKSpecie["name"];
		pokemon["desc"] = PKSpecie["flavor_text_entries"].filter(data =>
							   data["language"]["name"] == "es");
		pokemon["location"] = "";
		pokemon["items"] = PK["held_items"];
		pokemon["type01"] = "";
		pokemon["type02"] = null;
		pokemon["damage_to"] = damage_to;
		pokemon["damage_from"] = damage_from;
		
		pokemon["sprites"] = PK["sprites"];
		pokemon["preEvolution"] = PKSpecie["evolves_from_species"] == null? null: getIdFromUrl(PKSpecie["evolves_from_species"]["url"]);
		pokemon["nextEvolution"] = nextEvolution;
		pokemon["stage"] = stage;
		pokemon["abilities"] = PK["abilities"];
		pokemon["evolutionChain"] = evolutionChain
		return pokemon;

	}
};


//funcion: descripcion
botonera01.onclick = () => {
	console.log("asd");
	rnd = Math.floor((Math.random() * pokemon["desc"].length - 1) + 1);
	screen02.textContent = pokemon["desc"][rnd]["flavor_text"].replace("/n", "")
}//funcion: localizacion
localizacion=()=>{}
botonera02.onclick= localizacion()
//funcion: ataque
ataque=()=>{}
botonera03.onclick= ataque()
//funcion: defensa
defensa=()=>{}
botonera04.onclick= defensa()
//funcion: items
items=()=>{}
botonera05.onclick= items()
//funcion: habilidades
habilidades=()=>{}
botonera06.onclick= habilidades()
//funcion: Stats
Stats=()=>{}
botonera07.onclick= Stats()
//funcion: Unown
Unown=()=>{}
botonera08.onclick= Unown()
//funcion: peso y altura
peso=()=>{}
botonera09.onclick= peso()
//funcion: misc. (color, eggtype, forms)
misc=()=>{}
botonera10.onclick= misc()







async function showData(nameID){
	pokemon = await getPokemonData(nameID);

	//screen01->showPokemon
	spriteFront.src = pokemon["sprites"]["front_default"];
	spriteBack.src = pokemon["sprites"]["back_default"];
	// ID-Name
	let id = ("A-0000" + pokemon["id"]).substr(-3);
	let name = pokemon["name"][0].toUpperCase() + pokemon["name"].substr(1);
	PkName.textContent=  id + " - " + name;

	rnd = Math.floor((Math.random() * pokemon["desc"].length-1) + 1);
	screen02.textContent =  pokemon["desc"][rnd]["flavor_text"].replace("/n","")

	type01.textContent = pokemon["type01"];
	type02.textContent = pokemon["type01"];
	type02.textContent = pokemon["type01"];
	type01.className = `cell type ${pokemon["type01"]}`
	type02.className = `cell type ${pokemon["type02"]}`
	showPokemon.style.backgroundImage = `linear-gradient(125deg, var(--${pokemon["type02"]}), var(--${pokemon["type01"]}))`;
	}
function reanimate(){
	front = document.getElementById("spriteFront");
	back = document.getElementById("spriteBack");

	front.style.webkitAnimation = 'none';
	back.style.webkitAnimation = 'none';
	void front.offsetWidth;
	void back.offsetWidth;
	front.style.webkitAnimation = '';
	back.style.webkitAnimation = '';
}
function resize() {
	main01 = document.getElementById("main01");
	main02 = document.getElementById("main02");
	if(window.screen.orientation.type== "landscape-primary"){

		main01.classList.remove("hide");
		main02.classList.add("hide");
		let r = document.querySelector(':root');
		r.style.setProperty('--PK_W', document.getElementById("openPokedex").width + "px"); 

	}else{
		main01.classList.add("hide");
		main02.classList.remove("hide");
	}
}
function openClose(){
	main01 = document.getElementById("main01");
	main02 = document.getElementById("main02");

	if (main01.classList.value.includes("hide")) {
		main01.classList.remove("hide");
		main02.classList.add("hide");
	}else{
		main02.classList.remove("hide");
		main01.classList.add("hide");
	};


	main02Classes = document.getElementById("main02").classList.value;
	
	main01Classes.includes("hide");


}
async function search(RAWInput){
	showPokemon.classList.add("hide")
	loading.classList.remove("hide");
	await showData(RAWInput)
	loading.classList.add("hide");
	showPokemon.classList.remove("hide");
	reanimate()
}

window.addEventListener('load', 
	async ()=> { 
		resize();
		search("eevee");
	},false)
window.addEventListener('resize', resize);

document.getElementById("input").onkeypress= async (event)=>{
	console.log(event)
	if(event.code==="Enter" ){
		let RAWInput = document.getElementById("input").value
		search(RAWInput);
	}
}

for (var i = 0; i < botonera.length; i++) {
	botonera[i].onclick = (x)=>{
		botoneraBack.style.left = x["explicitOriginalTarget"].style.left;
		botoneraBack.style.top = x["explicitOriginalTarget"].style.top;
		//botoneraBack.style.left =botonera[i].style.left
	};
}
spriteBack.onload = function() {
    console.log("Image 2 ready to append");
};


arrows[0].onclick =()=>{
	search(pokemon["id"]+1);
}//up
arrows[1].onclick = () => { //down
	search(pokemon["id"] - 1);
}
arrows[2]//left
arrows[3]//right