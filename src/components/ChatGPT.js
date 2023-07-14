import React, { useState, useRef } from "react";
import Tesseract from 'tesseract.js';
import axios from "axios";
import Button from '@material-ui/core/Button'; 
import TextField from '@material-ui/core/TextField';



import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { createTheme, ThemeProvider } from '@mui/material/styles';

// import TextField from '@mui/material/TextField';


export default function ChatGPT() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [clicked, setClicked] = useState(false);
  const [clicked2, setClicked2] = useState(false);

  const HTTP = "http://localhost:8020/chat";

  const [imagePath, setImagePath] = useState("");
  const [text, setText] = useState("");


  function createData(guideline, output, deviation, percent) {
    return { guideline, output, deviation, percent };
  }


  const rows = [
    createData('Guideline 1: Expiry', '2008-10-31', 'No', '25.0'),
    createData('Guideline 2: Receipt Number', 'None', 'No', '25.0'),
    createData('Guideline 3: Shipping Number', '5400333', 'Yes', '0.0'),
    createData('Guideline 4: Spelling', '90', '90', '2.5'),
  ];


  const handleSubmit = (e) => {
    e.preventDefault();
    
    axios
      .post(`${HTTP}`, { prompt })
      .then((res) => {
        setResponse(res.data);
        console.log(prompt);
      })
      .catch((error) => {
        console.log(error);
      });

    setPrompt("");
    setClicked2(true);

  };


  const handleCushion = () => {
    let edited = prompt;
    let prefix = 'A checklist and excerpt of a manufacturing label will appear below. Answer the checklist based on your analysis of the excerpt. For each checklist item, your final answer should be "Yes" if it satisfies, and "No" if it does not. Format your answers like this: "Yes. Yes. No. Yes."';
    // let prefix = 'A checklist and excerpt of a manufacturing label will appear below. Answer the checklist based on your analysis of the excerpt. For each checklist item, your final answer should be "Yes" if it satisfies, and "No" if it does not.';
     let checklist = 'Checklist: 1. Does the label contain an expiry date? Call this date DATE1. Is DATE1 after January 1, 2005 and before December 31, 2011? Your answer should be "Yes." if the date satisfies the last question and "No." if DATE1 does not or if DATE1 does not exist. 2. Does the label contain a receiver number? If so, what is this number? Save the receiver number as a number called VAR1. Is VAR1 less than 5000? Your answer should be "Yes." if VAR1 is less than 5000 and "No." if VAR1 is not or if the label does not contain a receiver number. 3. Does the label contain a shipping note? If so, what is the shipping note? Save the shipping note as a number called VAR2. Your answer should be "Yes." if VAR2 is divisible by 3 and "No." if not or if the label does not contain a shipping label.';
    // let checklist = 'Checklist: 1. Does the label contain an expiry date? Call this date DATE1. Is DATE1 after January 1, 2005 and before December 31, 2011?  2. Does the label contain a receiver number? If so, what is this number? 3. Does the label contain a shipping note? If so, what is the shipping note? Save the shipping note as a number called VAR2.';

    let new_phrase = prefix + " " + checklist + ' "' + edited + '"';
    setPrompt(new_phrase);
  }

  const handlePrompt = (e) => {
    setPrompt(e.target.value);
  };


  const handleChange = (event) => {
    setImagePath(URL.createObjectURL(event.target.files[0]));
  }

  const handleClick = () => {
  
    
    Tesseract.recognize(
      imagePath,'eng',
      { 
        logger: m => console.log(m) 
      }
    )
    .catch (err => {
      console.error(err);
    })
    .then(result => {
      // Get Confidence score
      let confidence = result.data.confidence
     
      let text = result.data.text
      setText(text);

      console.log(text);
      console.log(confidence);
      console.log(result);


      setClicked(true);

      setPrompt(text);
    })
  }

  return (
    <div className="container container-sm p-1">
        <div>

        <h2 className="title text-center text-darkGreen">CertifAI</h2>

        <p>Part setting: KDMAT</p>
        <p>Country setting: USA</p>

        <br></br>


          {imagePath == "" ? " ": 
          <div>              
              <h3>Image uploaded</h3>
              <img src={imagePath} height={50} className="App-logo" alt="logo"/>
              <br></br>

            </div>

          }


        <input type="file" onChange={handleChange} />
        <Button   style={{
        backgroundColor: "#243624",
    }}


color="primary" variant="contained" onClick={handleClick} size="medium">process</Button>

        
        </div>


        {/* <div>

      {imagePath = "" ? " " : 
 */}




    <div>
    {!clicked ? " ": 
          <div>              
              <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="">Refine text below</label>

          <TextField
            // hiddenLabel
            // id="filled-hidden-label-normal"
            placeholder="Enter text"
            multiline
            variant="filled"
            type="text"
            fullWidth={true}
            value={prompt}
            onChange={handlePrompt}
          />

        </div>{" "}



        <Button variant="contained" onClick={handleCushion} type="submit">Confirm Text</Button>

      </form>


            </div>

          }

      {/* <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="">Refine text below</label>

          <TextField
            // hiddenLabel
            // id="filled-hidden-label-normal"
            placeholder="Enter text"
            multiline
            variant="filled"
            type="text"
            fullWidth={true}
            value={prompt}
            onChange={handlePrompt}
          />

        </div>{" "}



        <Button variant="contained" onClick={handleCushion} type="submit">Confirm Text</Button>

      </form> */}

      </div>





      <div className="bg-darkGreen  mt-2 p-1 border-5">
        <p className="text-light">
          {response ? "API response: " + response : "Generative responses here"}
        </p>
      </div>


      <div>
        {!clicked2 ? "" :
        <div>

      {/* <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Guideline</TableCell>
            <TableCell align="right">Output</TableCell>
            <TableCell align="right">Guideline Satisfaction</TableCell>
            <TableCell align="right">Deviation</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.guideline}
              </TableCell>
              <TableCell align="right">{row.output}</TableCell>
              <TableCell align="right">{row.deviation}</TableCell>
              <TableCell align="right">{row.percent}</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>


    <h1>Overall deviation percentage: 52.5%</h1> */}


    {/* <Button   style={{
        backgroundColor: "#960000",
    }}


color="primary" variant="contained" size="medium">Rejection</Button> */}

        
        </div>




          
          
          
        }
      </div>
    </div>
  );
}