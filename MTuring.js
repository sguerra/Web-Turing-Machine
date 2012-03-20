/*
	Máquina de Turing
	Sergio Guerra Vega  2010
*/

var aS = new Array(); // arreglo para función S
var state; // estado actual
var tproceso; // cadena proceso  
var time = 500;// tiempo de transición
var fString = ""; // cadena final
var fState = "";
var headState = "q"; 
var ctape= true;// combrobar cinta

var cabezal;// posicion inicial del cabezal 

var left = "I";// movimientos
var right = "D";

var rtime = 0; // tiempo en el que se mostrara el resultado
iniciaCinta(gi("String").value);// iniciamos cinta al principio

function M() // función pricipal
{
	var tString = gi("String").value; // campo String
	tproceso = "";// se inicializa el texto  de los procesos	
	gi("proceso").innerHTML = "";
	
	headState = "q"; 
	cabezal  = 1; // se inicia posicion del cabezal	
	 
	writeResult("","white");// inicializa Resultado
	
	fString = tString; // cadena actual en la cinta
	iniciaCinta(tString);// iniciar cinta
	proccessString(tString); // procesa cadena
	
	
}

// funciones de validavión L(M)

function checkState()// revisa el estado final
{

	if(gi("String").value!="")// tiene valor
	{	
		if(finalStateFits())//cumple algún estado final
		{
			if(ctape)//comprueba Cinta
			{
				if(checkString(fString))// cinta vacía
					writeResult("La cadena "+gi("String").value+" pertenece a L(M)","#339933");	
				else
					writeResult("La cadena "+gi("String").value+" no pertenece a L(M)","#993333");				
			}
			else
			{
				writeResult("La cadena "+gi("String").value+" pertenece a L(M)","#339933");	
			}
		}
		else
		{	
			writeResult("La cadena "+gi("String").value+" no pertenece a L(M)","#993333");	
		}	
	}
	else
	{
		writeResult("Introduzca cadena","#993333");
	}
		
}

function finalStateFits()
{
	for(i=0;i<aF.length;i++) // recorre estados finales
	{	
		if(aF[i].state==fState) // si cumple con algun estado final
		{
			i = aF.length;
			return true;
		}
	}
	
	return false;
}

function checkString(str)// revisa si la cadena en la cinta esta en blanco
{
	nstr = str;
	if(replaceAll(nstr,"B","").length==0)// la cinta esta en blanco
		return true;
	else
		return false;
}

// funciones cinta 


function iniciaCinta(str)
{
	headState = "q"; 
	cabezal=1;
	writeResult("","white");// inicializa Resultado
	tproceso = "";// se inicializa el texto  de los procesos	
	gi("proceso").innerHTML = "";

	cinta('B'+str+'B');
}

function cinta(str)
{
	var innhtml = "";
	
	nstr = str;
	// cabezal	
	innhtml += "<table align='center' cellpadding='1' cellspacing='1'>";
	innhtml += "	<tr>";
	innhtml += "		<td class='cabezal'>&nbsp;</td>";
	
	for(c=0;c<nstr.length;c++)
	{
		if(c==cabezal&&nstr!="BB")
			innhtml += "<td class='cabezal'>"+headState+"</td>";
		else
			innhtml += "<td class='cabezal'>&nbsp;</td>";
	}
		
	innhtml += "		<td class='cabezal'>&nbsp;</td>";				
	innhtml += "	</tr>";
	
	
	innhtml += "	<tr class='cinta'>";
	innhtml += "		<td class='celda'>&nbsp;</td>";
	
	for(c=0;c<nstr.length;c++)
	{
		innhtml += "	<td class='celda'>"+nstr.substring(c,c+1)+"</td>";	
	}

	innhtml += "		<td class='celda'>&nbsp;</td>";					
	innhtml += "	</tr>";
	innhtml += "</table>";
	
	gi("cinta").innerHTML = innhtml;
}

function checkTipe(ccobj) // comprobar cinta vacía al final
{
	if(ctape) // si comprueba cinta cambia a no comprobar cinta
	{
		ctape= false;
		ccobj.innerHTML = "No";
		ccobj.style.color = "#993333";
	}
	else// si no comprueba cinta cambia a comprobar cinta
	{
		ctape= true;		
		ccobj.innerHTML= "Sí";
		ccobj.style.color = "#339933";

	}
}

// funciones S --------------------

function S(cState,lChar,nState,rChar,move) // objeto S
{
	this.cState = cState;
	this.lChar = lChar;
	this.nState = nState;
	this.rChar = rChar;
	this.move = move;
	return this;
}  

function splitS(str) // se llena S del valor hallado en el campo S
{
	if(str=="")
	{
		writeResult("Introduzca función S : S([edo],[char])=S([edo],[char],[D ó I])","#993333");
		return;
	}
	writeResult("","white");
		
	var linestr;
	
	if(document.all)//IE
		linestr = str.split("\r\n"); // separa lineas
	else
		linestr = str.split("\n"); // separa lineas
		
	
	var lstr; // cadena izquierda
	var rstr; // cadena derecha
	
	for(i=0;i<linestr.length;i++)
	{
		var estr = linestr[i].split("="); // split =
		
		lstr = replaceFun(estr[0],"S");
		rstr = replaceFun(estr[1],"S");
						
		aS[i] = fillS(lstr,rstr); // llena S
	}
};

function fillS(lside,rside)
{
	slside = lside.split(","); // tupla de 2 S(cState,lChar)
	srside = rside.split(","); // tupla de 3 S(nState,rChar,move)
	
	return new S(	slside[0], // estado actual
						slside[1], // caracter leido
						srside[0], // estado siguiente
						srside[1], // caracter escrito
						srside[2]); // dirección movimiento
}

// funciones cadena--------------

function proccessChar(cState,str,index)
{
	var rChar = str.substring(index,index+1); // caractér leído
	var nstr = str; // nueva cadena
	var nindex = index; // nuevo índice
	
	var fits = false;
	
	for(i=0;i<aS.length;i++)
	{
		if(compareChar(cState,rChar,aS[i]))//cadena cumple S
		{	
			writeProccess(cState,rChar);// escribe proceso
			nstr = replaceString(nstr,aS[i].rChar,index);// hace el reemplazo
			
			if(aS[i].move==right) // derecha o izquierda
				nindex = nindex +1;
			else if(aS[i].move==left)
				nindex = nindex-1;
			
			headState = aS[i].nState;// actualizamos estado del cabezal al nuevo
			cabezal = nindex;// movemos el cabezal
			cinta(nstr); // movemos cinta
			
			fString = nstr; // cadena restante en la cinta
			fits = true;
			setTimeout("proccessChar(\""+aS[i].nState+"\",\""+nstr+"\","+nindex+")",time);
			
			i = aS.length;
		}
	}
	
	if(!fits)// acabo recursividad
	{
		headState = cState;// cabezal
		fState = cState; // estado actual al final
		cinta(nstr); // cinta al final
		checkState(); // revisa el estado final
	}
}

function velocity(percentage)
{
	time = time*percentage;	
}

function proccessString(str)// se procesa Cadena
{

	var index = 1;// cabezal en posición 1
	var rstr = "B"+str+"B"; // Cadena leída + BB
	state = "q";
	
	setTimeout("proccessChar(\""+state+"\",\""+rstr+"\","+index+")",time);
}

function compareChar(cState,chr,cS)
{
	if(chr==cS.lChar&&cState==cS.cState)// cumple con condición S(lChar,cState)
		return true;
	else // no cumple con condicipón S(lChar,cState)
		return false; 
}

function replaceString(str,chr,index)// reemplaza solo el carácter indicado en S
{
	var nstr = ""; // nueva cadena
	
	for(t=0;t<str.length;t++)
	{
		if(t!=index)
			nstr += str.substring(t,t+1);// cadena normal
		else
			nstr += chr; // valor agregado
	}
	
	return nstr;
} 


// demás funciones ----------------------

var aQ = new Array();
var aZ = new Array();
var aT = new Array();
var aF = new Array();

function fillFunctions() // llena las funciones desde S
{
	aQ = new Array();
	aZ = new Array();
	aT = new Array();
	aF = new Array();
	aS = new Array();
	
	var tS = gi("S").value; // campo S 
	splitS(tS);
	
	for(i=0;i<aS.length;i++)// llena cada funcion
	{
		fillFunction(aS[i],"Q");
		fillFunction(aS[i],"Z");
	}	
	
	aT[aT.length] = new T("B"); // agrebamos nulo a el lenguaje de la máquina
	
	// llenar campos
	fillField(aQ,'Q');
	fillField(aZ,'Z');
	fillField(aT,'T');
	fillField(aF,'F');
};

function fillField(array,field)
{
	var str = "";
	
	if(array.length==0)//funcion vacía
	{
		gi(field).value = "";
	}
	
	for(i=0;i<array.length;i++)
	{
		switch(field)
		{
			case "Q":
			case "F": // llena Q y F
				str += array[i].state;
				break;
			case "Z": 
			case "T": // llena Z y T (ZU'B')	
				str += array[i].chr;
				break;
			default:
				alert("Error al llenar campo "+field);
		
		}
		
		if(i<array.length-1) // coma intermedia
			str +=",";
		else
			str +="";
	}
	
	gi(field).value = str;
}

function fillFunction(fS,fun)// llena elementos distintos desde S
{
	
	var different = true;// estado o caractér nuevo es diferente de los ya insertados

	switch(fun)
	{
		case "Q":
		case "F": // llena Q y F
			
			var lQ = aQ.length;
			
			if(lQ==0)// no hay Estados
			{
				aQ[0] = new Q(fS.cState);
				aF[0] = new F(fS.cState); 
			}
			else
			{
				for(a=0;a<lQ;a++) // recorre Q
				{
					if(aQ[a].state==fS.cState)// si ya existe el estado
					{
						different = false;
					}
				}
				
				if(different)// inserta diferentes
				{
					aQ[lQ] = new Q(fS.cState);
					aF[lQ] = new F(fS.cState);
				}
			}
			
			break;
		case "Z": 
		case "T": // llena Z y T (ZU'B')
		
			var lZ = aZ.length;
			
			if(lZ==0)// no hay Estados
			{
				aZ[0] = new Z(fS.lChar);
				aT[0] = new T(fS.lChar); 
			}
			else
			{
				for(a=0;a<lZ;a++) // recorre Z
				{
					if(aZ[a].chr==fS.lChar)// si ya existe el caractér
					{
						different = false;	
					}
				}
				
				if(different&&fS.lChar!="B") // inserta diferentes que sean distintos al caracter nulo
				{
					aZ[lZ] = new Z(fS.lChar);
					aT[lZ] = new T(fS.lChar);
				}
			}

			break;
		default:
			alert("Error al llenar funcion "+fun);
	
	}
}	
	
function fillF(str) // llena F desde campo F
{
	sstr = str.split(",");
	
	if(str.length>0)// si no esta vacia
	{
	
		aF = new Array();
		
		for(i=0;i<sstr.length;i++)
		{
			aF[i] = new F(sstr[i]);
		}
		writeResult("","white");
	}
	else
	{
		writeResult("Introduzca al menos un estado final (F)","#993333");
		gi("F").value = "q";
	}
}	
	
function F(state) // objeto F
{
	this.state = state;	
	return this;
}  

function Q(state) // objeto Q
{
	this.state = state;	
	return this;
}  

function Z(chr) // objeto Z
{
	this.chr = chr;	
	return this;
}  

function T(chr) // objeto T
{
	this.chr = chr;	
	return this;
}  


//generales -------------

function gi(id) // getElementById
{
	return document.getElementById(id);
}


function writeProccess(cState,rChar)// escribe Proceso
{
	tproceso += "S("+cState+","+rChar+")<br>";
	gi("proceso").innerHTML = tproceso;
}


function writeResult(str,color)
{
	gi("resultado").style.color = color;
	gi("resultado").innerHTML = str;
}


function replaceFun(str,fun) // reemplaza S(str) -> str
{
	nstr = str;
		
	nstr = nstr.replace(fun,"");
	nstr = nstr.replace("(","");
	nstr = nstr.replace(")","");
	
	return nstr;
}


function replaceAll(str,cOld,cNew) // reemplaza todo
{
	var nstr = str; 
	while(nstr.indexOf(cOld)>=0)
	{
		nstr = nstr.replace(cOld,cNew);
	}
	return nstr;
}

// maquinas precargadas

var aMachine = new Array();

function loadMachines()// carga las máquinas preprogramagas 
{
	var lskip; // salto de linea
	if(document.all)//IE
		lskip= "\r\n";
	else
		lskip= "\n";

	aMachine[0] = new tMachine("Nueva Máquina...","(q,s)=S(q,B,D)","ssssss","q",true);
	aMachine[1] = new tMachine("Cadenas de {abc}*",
								"S(q,a)=S(q1,B,D)"+lskip+"S(q1,b)=S(q2,B,D)"+lskip+"S(q2,c)=S(q,B,D)",
								"abcabcabcabc",
								"q",
								true);
	aMachine[2] = new tMachine("Palíndroma de 0s y 1s",
								"S(q,0)=S(q1,B,D)"+lskip
								+"S(q,1)=S(q4,B,D)"+lskip
								+"S(q1,0)=S(q1,0,D)"+lskip
								+"S(q1,1)=S(q1,1,D)"+lskip
								+"S(q1,B)=S(q2,B,I)"+lskip
								+"S(q2,0)=S(q3,B,I)"+lskip
								+"S(q3,1)=S(q3,1,I)"+lskip
								+"S(q3,0)=S(q3,0,I)"+lskip
								+"S(q3,B)=S(q,B,D)"+lskip
								+"S(q4,0)=S(q4,0,D)"+lskip
								+"S(q4,1)=S(q4,1,D)"+lskip
								+"S(q4,B)=S(q5,B,I)"+lskip
								+"S(q5,1)=S(q6,B,I)"+lskip
								+"S(q6,1)=S(q6,1,I)"+lskip
								+"S(q6,0)=S(q6,0,I)"+lskip
								+"S(q6,B)=S(q,B,D)",
								"0110110110110",
								"q,q2,q5",
								true);
	loadSelect(aMachine);	
	loadMachine(gi("tMachines"));
}

function loadSelect(machine)// carga combo desde máquinas en el arreglo
{	
	var innhtml = "";
	innhtml += "<select id='tMachines' onchange='loadMachine(this);'>";	
	for(i=0;i<machine.length;i++)
	{
		innhtml += "<option value='"+i+"'>"+machine[i].title+"</option>";
	}
	innhtml += "</select>";		
	
	gi("maquina").innerHTML = innhtml;					
}

function loadMachine(obj)
{
	var aM = aMachine[obj.selectedIndex];
	
	gi("S").value = aM.fS; // carga S
	fillFunctions(); // simula onblur

	gi("F").value = aM.fF; // carga F
	fillF(aM.fF);
	
	gi("String").value = aM.str; 
	iniciaCinta(gi("String").value); // carga cadena y cinta
	ctape = !aM.chckTipe;
	gi("ccinta").click();// párametro comprobar cinta
	
	
	
}

function tMachine(title,fS,str,fF,chckTipe)// objeto máquina de turing
{
	this.title = title;
	this.fS= fS;
	this.str= str;
	this.fF= fF;
	this.chckTipe= chckTipe;

	return this;
} 
loadMachines(); // carga máquinas preprogramadas;
