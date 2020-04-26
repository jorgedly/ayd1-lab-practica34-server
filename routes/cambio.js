const express = require("express");
const router = express.Router();
const request = require('request');
const xml2js = require('xml2js');

router.post('/dia', (req, res) => {
  const xml = `
<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
  <Body>
      <TipoCambioDia xmlns="http://www.banguat.gob.gt/variables/ws/"/>
  </Body>
</Envelope>`;

  const options = {
    url: 'http://www.banguat.gob.gt/variables/ws/TipoCambio.asmx?WSDL',
    method: 'POST',
    body: xml,
    headers: {
      'Host': 'www.banguat.gob.gt',
      'Content-Type': 'text/xml; charset=utf-8',
      'Content-Length': xml.length,
      'SOAPAction': "http://www.banguat.gob.gt/variables/ws/TipoCambioDia"
    }
  };

  request(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const parser = new xml2js.Parser({ explicitArray: false, trim: true });
      parser.parseString(body, (err, result) => {
        const valor = result['soap:Envelope']
        ['soap:Body']
        ['TipoCambioDiaResponse']
        ['TipoCambioDiaResult']
        ['CambioDolar']
        ['VarDolar']
        ['referencia'];
        res.send(
          valor
        )
      });
    };
  });

});

router.post('/fecha', (req, res) => {
  const { fecha } = req.body;
  const xml = `
<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
    <Body>
        <TipoCambioFechaInicial xmlns="http://www.banguat.gob.gt/variables/ws/">
            <fechainit>${fecha}</fechainit>
        </TipoCambioFechaInicial>
    </Body>
</Envelope>`

  const options = {
    url: 'http://www.banguat.gob.gt/variables/ws/TipoCambio.asmx?WSDL',
    method: 'POST',
    body: xml,
    headers: {
      'Host': 'www.banguat.gob.gt',
      'Content-Type': 'text/xml; charset=utf-8',
      'Content-Length': xml.length,
      'SOAPAction': "http://www.banguat.gob.gt/variables/ws/TipoCambioFechaInicial"
    }
  };

  request(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const parser = new xml2js.Parser({ explicitArray: false, trim: true });
      parser.parseString(body, (err, result) => {
        res.send(
          result
          ['soap:Envelope']
          ['soap:Body']
          ['TipoCambioFechaInicialResponse']
          ['TipoCambioFechaInicialResult']
          ['Vars']
          ['Var']
        );
      });
    };
  });
});

module.exports = router;