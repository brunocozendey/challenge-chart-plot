import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  
function Chart() {
  const styles = {
    container: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    line: {
      width: '100%',
      backgroundColor: '#FFF',
      
    },
    middle: {
      width: '100%',
      backgroundColor: '#FFF',
      maxHeight: '70%',
      margin:'0',
      padding:'0'
    },
    footer: {
      width: '100%',
      backgroundColor: '#dddee1',
      height: '100%',
      paddingLeft:"80px",
      paddingTop:"20px"
      
    },
    graph: {
      backgroundColor: '#FFF',
      width: "100%",
      height:"100%",
    },
    top:{
      width: '100%',
      height: '70px',
      backgroundColor: '#dddee1',
      paddingLeft: '80px',
      paddingBotom: '10px',
      color: "#313743"
    },
    textarea:{
      resize: "vertical", 
      width: "100%",
      fontSize: "14px",
      fontFamily: "source-code-pro", 
      lineHeight: "1.5", 
      backgroundColor: "#f7f7f7", 
      color: "#333", 
      minHeight: "10em",
      rows: 10
    },
    button:{
      width: "140px",
      height: "40px",
      fontSize: "14px",
      fontFamily: "Source Sans Pro", 
      backgroundColor: "#017eff", 
      color: "#FFF", 
      border: 0,
      borderRadius: 3
    }

  };


    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: false,
            text: 'Chart',
          },
        }
      };

      const [labels, setLabels] = useState([0,1]);
      const [data, setData] = useState(
        {
        labels,
        datasets: [
          {
            label: "",
            data: [0]
          }
        ],
      }
      );


    const [textAreaValue, setTextAreaValue] = useState("");
    
    const handleSubmit = (event) => {
          event.preventDefault();
          
          let events_input = textAreaValue.split(/\n/g);
          let events_json = createEventsJson(events_input)
          let chart_labels = createLabels(events_json)
          let chart_data = createData(events_json)

          
         
          let data_sets = []

          for (let data in chart_data) {
            let generated_color = createColor()
            let dataset_name = createDatasetName(data)
            data_sets.push(
              {
                label: dataset_name,
                data: [chart_data[data].start_value, chart_data[data].stop_value],
                borderColor: generated_color,
                backgroundColor: generated_color,
              }
            )
          }
          setLabels(chart_labels)
          setData({labels,datasets: data_sets})
        };

    const handleTextAreaChange = (event) => {
      setTextAreaValue(event.target.value);
    };
    
    const parseJson = (text) => {
      text = text.replace(/'/g, '"');
      text = text.replace(/([a-zA-Z0-9_]+):/g, '"$1":');      
      try {
        return JSON.parse(text);
        } catch (error) {
          console.error(error);
          alert("Invalid JSON input");
        }
    };

    const createEventsJson = (events_input) =>{
      let events_json = {"data":[], "span":[]};
      events_input.forEach((event)=>{
        let event_json = parseJson(event)
        if (event_json.type == 'data'){
          events_json.data.push(event_json)
        }
        else if (event_json.type == 'span'){
          events_json.span.push(event_json)
        }
        else{
          events_json[event_json.type] = event_json
        }
      }
      )
      return events_json
    };

    const formatDate = (date) => {
      let fDate = new Date(date)
      // return fDate.getTime()
      return fDate.getMinutes()+":"+fDate.getSeconds()
    }

    const createLabels = (events_json) => {
      let begin =  formatDate(events_json.start.timestamp)
      let end =  formatDate(events_json.stop.timestamp)
      if (events_json.span.length > 0 ){
        begin = formatDate(events_json.span.at(-1).begin)
        end = formatDate(events_json.span.at(-1).end)
      }
      let labels = new Set([begin,end])
      return Array.from(labels).sort()
    }

    const createData = (events_json) => {
      let data_json = {}
      events_json.data.forEach((data)=>{
        let name = ""
        events_json.start.group.forEach((field) =>{
          name = name+"_"+data[field].toLowerCase() 
        })
        events_json.start.select.forEach((opt)=>{
          if (name+"_"+opt in data_json){ 
            data_json[name+"_"+opt].stop_time = formatDate(data['timestamp'])
            data_json[name+"_"+opt].stop_value = data[opt]
          }
          else{
            data_json[name+"_"+opt] = {"start_time":formatDate(data['timestamp']),"start_value":data[opt]}
          }
        })
      })
      return data_json
    }

    const createColor = () => {
      let r = Math.floor(Math.random() * 256);
      let g = Math.floor(Math.random() * 256);
      let b = Math.floor(Math.random() * 256);
      return `rgb(${r}, ${g}, ${b})`
    }

    const createDatasetName = (name) => {
      let name_formated = name.split("_");
      for (var i = 0; i < name_formated.length; i++) {
        name_formated[i] = name_formated[i].charAt(0).toUpperCase() + name_formated[i].slice(1);
      }
      return name_formated.join(" ")
    }

    //{time: 1519780251000, value: 1.6}
    //{time: 1519780251005, value: 1.6}
    // const createDataValues = (datas,chart_labels) =>{

    // }

    return (
        <div style={styles.container}>
          <div style={styles.top}>
            <h2>Bruno's Challenge</h2>
          </div>
          <div style={styles.line}>
            <form onSubmit={handleSubmit}>
            <textarea style={styles.textarea} name="event" onChange={handleTextAreaChange} placeholder="Enter data"/>
            </form>
          </div>
          <div style={styles.middle}>
            <Line options={options} data={data} style={styles.graph}/>
          </div>
          <div style={styles.footer}>
            <button style={styles.button} onClick={handleSubmit}>GENERATE CHART</button>
          </div>
        </div>
    )
}

export default Chart;