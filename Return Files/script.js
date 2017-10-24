var covCalc; 
var PDFString;
var table = [];
var coord = [];
var spaceItems = [];
var moneyItems = [];
var patts = [
  /Interest expense[\s*\d*]*\n/i,
  /net income[\s*\d*]*\n/i,
  /Total Liabilities and Shareholders’ Equity[\s*\d*]*\n/i,
  /Intangible assets[\s*\d*]*\n/i,
  /Other long-term liabilities[\s*\d*]*\n/i
];

$.get('Covenants with Calc2.txt', function(data) {
  covCalc = data;
});

$.get('FYE 2016 (pdf.io).txt', function(data) {
  PDFString = data;
});

function compile() {
  var listItems = covCalc.match(/a [\w*\s*\n*]* of/g);
  for (var i = 0; i < 2; i++) {
    coord.push(new Coord());
    coord[i].index = covCalc.indexOf(listItems[i]);
    coord[i].len = listItems[i].length;
  }
  next();
  cleanPDF();
  readPDF();
}

function next() {
  for (var i = 0; i < coord.length; i++) {
    $('#tp').append(covCalc.substr(coord[i].index + 2, coord[i].len - 5) + "---");
    var spaceAt = covCalc.substr(coord[i].index + coord[i].len + 4).indexOf(" ");
    spaceItems.push(spaceAt);
    $('#tp').append(covCalc.substr(coord[i].index + coord[i].len + 1, spaceItems[i] + 3) + "---");
    moneyItems.push(covCalc.substr(coord[i].index + coord[i].len + 4 + spaceItems[i] + 1).indexOf(". "));
    $('#tp').append(covCalc.substr(coord[i].index + coord[i].len + 4 + spaceItems[i] + 1, moneyItems[i] - 1) + "---<br><br>");
  }
}

function cleanPDF() {
  PDFString = PDFString.replace(/\(/g, "");
  PDFString = PDFString.replace(/\)/g, "");
  PDFString = PDFString.replace(/\$/g, "");
  PDFString = PDFString.replace(/,/g, "");
  PDFString = PDFString.replace(/%/g, "");
}

function readPDF() {
  var headers;
  for (var i = 0; i < patts.length; i++) {
    headers = PDFString.match(patts[i])[0].replace(/\s\s+/g, ' ').split(" ");
    table.push(new Row());
    if (i == 4) {
      table[i].header = headers[0] + " " + headers[1] + " " + headers[2];
      table[i].value = headers[3];
    } else if (i == 2) {
      table[i].header = headers[0] + " " + headers[1] + " " + headers[2] + " " + headers[3] + " " + headers[4];
      table[i].value = headers[5];
    } else {
      table[i].header = headers[0] + " " + headers[1];
      table[i].value = headers[2];
    }
    $('#tp').append(table[i].header + " " + table[i].value + "<br><br>");
  }
  var netWorth = Number(table[2].value) - Number(table[3].value) + Number(table[4].value);
  $('#tp').append("Tangible Net Worth = " + table[2].value + " Total Liabilities and Shareholders\' Equity - 0 (no advances) - " + table[3].value + " Intangible Assets + " + table[4].value + " Other long-term liabilities <br><br>")
  $('#tp').append("Tangible Net Worth = " + netWorth);
}

function Coord() {
  this.index;
  this.len;
}

function Row() {
  this.header;
  this.value;
}
