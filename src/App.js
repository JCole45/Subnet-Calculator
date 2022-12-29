import React, { useState } from "react";
import "./App.css";

function App() {
  const [ip, setIp] = useState({
    firstOctet: 0,
    secondOctet: 0,
    thirdOctet: 0,
    finalOctet: 0,
    subnet: 0,
  });
  const [ipclass, setClass] = useState({ class: "", size: "", number: "" });
  const [host_bits, setHostBits] = useState();
  const [block_size, setBlockSize] = useState();
  const [k_value, setKvalue] = useState();
  const [ip_range, setIpRange] = useState([]);
  const [network_ip, setNetworkIp] = useState([]);
  const [broadcast_ip, setBroadCastIp] = useState([]);

  const arr = [128, 64, 32, 16, 8, 4, 2, 1]

  const handleChange = (e) => {
    console.log(23 % 8);
    console.log(e.key);
    let intermediary = { ...ip };
    if (Number(e.target.value)) {
      intermediary[e.target.name] = Number(e.target.value);
      setIp(intermediary);
    }
  }

  const handleDeleteNumberField = (e) => {
    let input_fields = document.getElementsByClassName("input-field");
    console.log(e);
    console.log(e.key);
    console.log(e.target.name);
    if (e.key === "Backspace" && ip[e.target.name].toString().length === 1) {
      let intermediary = { ...ip };
      intermediary[e.target.name] = "";
      setIp(intermediary);
    }

    if (e.key === "." && e.target.dataset.position < 4) {
      console.log(input_fields)
      console.log(e.target.dataset.position)
      input_fields[Number(e.target.dataset.position) + 1].focus()
    }
  }



  const handleSubmit = () => {
    try {
      let octets = Object.keys(ip);
      for (let i = 0; i < octets.length - 1; i++) {
        if (ip[octets[i]] >= 256) {
          let intermediary = { ...ip };
          intermediary[octets[i]] = 255;
          setIp(intermediary);
        }

        if (ip[octets[i]] < 0) {
          let intermediary = { ...ip };
          intermediary[octets[i]] = 0;
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

      if (ip.firstOctet <= 126) {
        setClass({ class: "A", size: 8, number: 0 });
      } else if (ip.firstOctet <= 191) {
        setClass({ class: "B", size: 16, number: 1 });
      } else if (ip.firstOctet <= 223) {
        setClass({ class: "C", size: 24, number: 2 });
      } else {
        setClass({ class: "D", size: 32, number: 3 });
      }

      console.log("subnet:", ip.subnet);
      let host_bits_ = 32 - Number(ip.subnet);
      setHostBits(32 - host_bits_);
      setBlockSize(2 ** host_bits_);
      console.log(host_bits);

      let k = ip.subnet % 8;
      setKvalue(k);

      let subnet_octet;
      if (ip.subnet % 8 !== 0) {
        subnet_octet = Math.floor(ip.subnet / 8) + 1;
      } else {
        subnet_octet = Math.floor(ip.subnet / 8);
      }

      let new_ip = {
        firstOctet: ip.firstOctet,
        secondOctet: ip.secondOctet,
        thirdOctet: ip.thirdOctet,
        finalOctet: ip.finalOctet,
      };

      //sets octect subnet occurs in, and all subsequent octets to 0
      let b = subnet_octet;
      console.log("number for whileloop", b);
      while (b < octets.length) {
        new_ip[octets[b - 1]] = 0;
        b++;
      }

      console.log(new_ip);
      console.log(subnet_octet);
      console.log("k: ", k);
      console.log("k_value: ", k_value);
      console.log("increment: " + arr[k_value - 1]);

      let ips_holder = [];

      let increment_value = arr[k - 1];
      if (k && k <= 8 && increment_value !== undefined) {
        for (let y = 0; y <= 256; y += increment_value) {
          new_ip[octets[subnet_octet - 1]] = y;
          //setIpRange([...ip_range, new_ip]);
          ips_holder.push({ ...new_ip });
          console.log(y);
          console.log(ip_range);
        }
      }
      console.log("done");
      setIpRange(ips_holder);

      for (let j = 0; j < ips_holder.length; j++) {
        let ip1 = { ...ips_holder[j] };
        let ip2 = ips_holder[j + 1]
          ? { ...ips_holder[j + 1] }
          : { ...ips_holder[j] };

        console.log(ip1, ip2);
        console.log(
          ip1[octets[subnet_octet - 1]],
          ip[octets[subnet_octet - 1]],
          ip2[octets[subnet_octet - 1]]
        );

        if (
          ip[octets[subnet_octet - 1]] === ip1[octets[subnet_octet - 1]]
        ) {
          setNetworkIp([ip1]);
          //setBroadCastIp
        }
        if (
          ip[octets[subnet_octet - 1]] > ip1[octets[subnet_octet - 1]] &&
          ip[octets[subnet_octet - 1]] < ip2[octets[subnet_octet - 1]]
        ) {
          ip2[octets[subnet_octet - 1]] = ip2[octets[subnet_octet - 1]] - 1;
          if (ip2[octets[subnet_octet]]) {
            ip2[octets[subnet_octet]] = 255;
          }
          //ip2[octets[subnet_octet]] && ip2[octets[subnet_octet]] = 255
          setNetworkIp([ip1]);
          setBroadCastIp([ip2]);
          break;
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">

      <h3>Subnet Calculator</h3>
      <input
        onChange={handleChange}
        onKeyDown={handleDeleteNumberField}
        type="text"
        data-position={0}
        name="firstOctet"
        value={ip.firstOctet}
        className="input-field"
      />
      <span className="dot">.</span>
      <input
        onChange={handleChange}
        onKeyDown={handleDeleteNumberField}
        type="text"
        data-position={1}
        name="secondOctet"
        value={ip.secondOctet}
        className="input-field"
      />
      <span className="dot">.</span>
      <input
        onChange={handleChange}
        onKeyDown={handleDeleteNumberField}
        type="text"
        data-position={2}
        name="thirdOctet"
        value={ip.thirdOctet}
        className="input-field"
      />
      <span className="dot">.</span>
      <input
        onChange={handleChange}
        onKeyDown={handleDeleteNumberField}
        type="text"
        data-position={3}
        name="finalOctet"
        value={ip.finalOctet}
        className="input-field"
      />
      <span className="slash">/</span>
      <input
        onChange={handleChange}
        onKeyDown={handleDeleteNumberField}
        type="text"
        data-position={4}
        name="subnet"
        value={ip.subnet}
        className="input-field"
      />
      <input className="submit-button" onClick={handleSubmit} value="Submit"></input>

      <div style={{ display: "block", marginTop: "10px" }}>
        block size: {block_size}
      </div>
      <div style={{ display: "block", marginTop: "10px" }}>
        IP Class: {ipclass.class}
      </div>
      <div style={{ display: "block" }}>host bits: {host_bits}</div>
      <div style={{ display: "block", marginBottom: "10px" }}>
        k value: {k_value}
      </div>
      <div style={{ display: "block", marginBottom: "10px" }}>
        network ip:
        {network_ip.map((net_ip) => {
          return (
            net_ip.firstOctet +
            " . " +
            net_ip.secondOctet +
            " . " +
            net_ip.thirdOctet +
            " . " +
            net_ip.finalOctet
          );
        })}
      </div>

      <div style={{ display: "block", marginBottom: "10px" }}>
        broadcast ip:
        {broadcast_ip.map((broad_ip) => {
          return (
            broad_ip.firstOctet +
            " . " +
            broad_ip.secondOctet +
            " . " +
            broad_ip.thirdOctet +
            " . " +
            broad_ip.finalOctet
          );
        })}
      </div>

      <h5>Ip Range</h5>
      {ip_range.map((ip_) => {
        return (
          <div style={{ display: "block", marginBottom: "10px" }}>
            {ip_.firstOctet +
              " . " +
              ip_.secondOctet +
              " . " +
              ip_.thirdOctet +
              " . " +
              ip_.finalOctet}
          </div>
        );
      })}
    </div>
  );
}

export default App;
