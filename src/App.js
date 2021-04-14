import React, { useState } from "react";
import "./App.css";

function App() {
  const [ip, setIp] = useState({
    firstOctect: 123,
    secondOctect: 255,
    thirdOctect: 255,
    finalOctect: 132,
    subnet: 20,
  });
  const [ipclass, setClass] = useState({ class: "", size: "", number: "" });
  const [host_bits, setHostBits] = useState();
  const [block_size, setBlockSize] = useState();
  const [k_value, setKvalue] = useState();
  const [ip_range, setIpRange] = useState([]);
  const [network_ip, setNetworkIp] = useState([]);
  const [broadcast_ip, setBroadCastIp] = useState([]);

  const arr = [128, 64, 32, 16, 8, 4, 2, 1];

  const handleChange = (e) => {
    console.log(23 % 8);
    let intermediary = { ...ip };
    intermediary[e.target.name] = Number(e.target.value);
    setIp(intermediary);
  };

  const handleSubmit = () => {
    let octects = Object.keys(ip);
    for (let i = 0; i < octects.length - 1; i++) {
      if (ip[octects[i]] >= 256) {
        let intermediary = { ...ip };
        intermediary[octects[i]] = 255;
        setIp(intermediary);
      }

      if (ip[octects[i]] < 0) {
        let intermediary = { ...ip };
        intermediary[octects[i]] = 0;
        setIp(intermediary);
      }
    }
    if (ip["subnet"] > 32) {
      let intermediary = { ...ip };
      intermediary["subnet"] = 32;
      setIp(intermediary);
    } else if (ip["subnet"] < 1) {
      let intermediary = { ...ip };
      intermediary["subnet"] = 1;
      setIp(intermediary);
    }

    if (ip.firstOctect <= 126) {
      setClass({ class: "A", size: 8, number: 0 });
    } else if (ip.firstOctect <= 191) {
      setClass({ class: "B", size: 16, number: 1 });
    } else if (ip.firstOctect <= 223) {
      setClass({ class: "C", size: 24, number: 2 });
    } else {
      setClass({ class: "D", size: 32, number: 3 });
    }

    console.log("subnet:", ip.subnet);
    setHostBits(32 - Number(ip.subnet));
    setBlockSize(2 ** host_bits);
    console.log(host_bits);

    let k = ip.subnet % 8;
    setKvalue(k);

    let subnet_octect;
    if (ip.subnet % 8 !== 0) {
      subnet_octect = Math.floor(ip.subnet / 8) + 1;
    } else {
      subnet_octect = Math.floor(ip.subnet / 8);
    }

    let new_ip = {
      firstOctect: ip.firstOctect,
      secondOctect: ip.secondOctect,
      thirdOctect: ip.thirdOctect,
      finalOctect: ip.finalOctect,
    };

    let b = subnet_octect;
    console.log("number for whileloop", b);
    while (b < octects.length) {
      new_ip[octects[b - 1]] = 0;
      b++;
    }

    console.log(new_ip);
    console.log(subnet_octect);
    console.log("k: ", k);
    console.log("k_value: ", k_value);
    console.log("increment: " + arr[k_value - 1]);

    let ips_holder = [];

    let increment_value = arr[k_value - 1];
    if (k_value && k_value <= 8 && increment_value !== undefined) {
      for (let y = 0; y <= 256; y += increment_value) {
        new_ip[octects[subnet_octect - 1]] = y;
        //setIpRange([...ip_range, new_ip]);
        ips_holder.push({ ...new_ip });
        console.log(y);
        console.log(ip_range);
      }
    }
    console.log("done");
    setIpRange(ips_holder);

    for (let j = 0; j < ips_holder.length; j++) {
      let ip1 = ip_range[j];
      let ip2 = ip_range[j + 1];

      console.log(ip1, ip2);
      console.log(
        ip1[octects[subnet_octect - 1]],
        ip[octects[subnet_octect - 1]],
        ip2[octects[subnet_octect - 1]]
      );
      if (
        ip[octects[subnet_octect - 1]] > ip1[octects[subnet_octect - 1]] &&
        ip[octects[subnet_octect - 1]] < ip2[octects[subnet_octect - 1]]
      ) {
        setNetworkIp([ip1]);
        setBroadCastIp([ip2]);
        break;
      }
    }
  };

  return (
    <div className="App">
      <input
        onChange={handleChange}
        type="number"
        name="firstOctect"
        value={ip.firstOctect}
      />
      <input
        onChange={handleChange}
        type="number"
        name="secondOctect"
        value={ip.secondOctect}
      />
      <input
        onChange={handleChange}
        type="number"
        name="thirdOctect"
        value={ip.thirdOctect}
      />
      <input
        onChange={handleChange}
        type="number"
        name="finalOctect"
        value={ip.finalOctect}
      />
      <input
        onChange={handleChange}
        type="number"
        name="subnet"
        value={ip.subnet}
      />

      <button onClick={handleSubmit}>Submit</button>

      <div style={{ display: "block" }}>block size: {block_size}</div>
      <div style={{ display: "block" }}>host bits: {host_bits}</div>
      <div style={{ display: "block", marginBottom: "10px" }}>
        k value: {k_value}
      </div>
      <div style={{ display: "block", marginBottom: "10px" }}>
        network ip:
        {network_ip.map((net_ip) => {
          return (
            net_ip.firstOctect +
            " . " +
            net_ip.secondOctect +
            " . " +
            net_ip.thirdOctect +
            " . " +
            net_ip.finalOctect
          );
        })}
      </div>

      <div style={{ display: "block", marginBottom: "10px" }}>
        broadcast ip:
        {broadcast_ip.map((broad_ip) => {
          return (
            broad_ip.firstOctect +
            " . " +
            broad_ip.secondOctect +
            " . " +
            broad_ip.thirdOctect +
            " . " +
            broad_ip.finalOctect
          );
        })}
      </div>

      {ip_range.map((ip_) => {
        return (
          <div style={{ display: "block", marginBottom: "10px" }}>
            {ip_.firstOctect +
              " . " +
              ip_.secondOctect +
              " . " +
              ip_.thirdOctect +
              " . " +
              ip_.finalOctect}
          </div>
        );
      })}
    </div>
  );
}

export default App;
