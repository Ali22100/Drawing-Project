import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Dropdown } from "react-bootstrap";
import { FaUpload, FaTrashAlt, FaBrush, FaMagic, FaPaintBrush, FaGlobe, FaNewspaper, FaImages, FaHistory, FaMoon, FaSun, FaBell } from "react-icons/fa";
import { GiEyedropper } from "react-icons/gi";
import { RiCheckboxBlankFill, RiImageAddLine, RiShapesFill } from "react-icons/ri";
import { BsCircleFill, BsStars } from "react-icons/bs";
import { RxSlash } from "react-icons/rx";
import { LuFocus } from "react-icons/lu";
import { MdCropLandscape } from "react-icons/md";
import { useNavigate } from "react-router-dom"; 
import "./DrawPage.css";
import { CiFacebook, CiTwitter } from "react-icons/ci";
import { AiOutlineYoutube } from "react-icons/ai";

const colors = [
  "#F44336", "#FF9800", "#FFEB3B", "#4CAF50", "#03A9F4",
  "#673AB7", "#E040FB", "#000000", "#F8BBD0", "#BCAAA4", "#B0BEC5"
];

const DrawingSection = () => {

    const [darkMode, setDarkMode] = useState(false);
  
    const toggleTheme = () => {
      setDarkMode(prev => !prev);
    };
  
    // Apply body background when darkMode changes
    useEffect(() => {
      document.body.style.backgroundColor = darkMode ? '#ffffffff' : '#0d1117';
    }, [darkMode]);
  



  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);

  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(8);
  const [isErasing, setIsErasing] = useState(false);
  const [selectedShape, setSelectedShape] = useState(null);
  const [isPortrait, setIsPortrait] = useState(false);

  const navigate = useNavigate(); // ✅ Works only inside function component

  const handleFocusClick = () => {
    navigate("/focus");
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    startX.current = e.clientX - rect.left;
    startY.current = e.clientY - rect.top;

    if (!selectedShape) {
      const ctx = canvas.getContext("2d");
      ctx.beginPath();
      ctx.moveTo(startX.current, startY.current);
      canvas.isDrawing = true;
    } else {
      isDrawing.current = true;
    }
  };

  const draw = (e) => {
    if (selectedShape || !canvasRef.current.isDrawing) return;

    const ctx = canvasRef.current.getContext("2d");
    ctx.strokeStyle = isErasing ? "#ffffff" : color;
    ctx.lineWidth = size;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = (e) => {
    const canvas = canvasRef.current;
    canvas.isDrawing = false;

    if (!isDrawing.current || !selectedShape) return;

    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = color;
    ctx.lineWidth = size;

    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    if (selectedShape === "rectangle") {
      ctx.strokeRect(startX.current, startY.current, endX - startX.current, endY - startY.current);
    } else if (selectedShape === "circle") {
      const radius = Math.sqrt(
        Math.pow(endX - startX.current, 2) + Math.pow(endY - startY.current, 2)
      );
      ctx.beginPath();
      ctx.arc(startX.current, startY.current, radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (selectedShape === "line") {
      ctx.beginPath();
      ctx.moveTo(startX.current, startY.current);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }

    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const toggleOrientation = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const newPortrait = !isPortrait;
    setIsPortrait(newPortrait);

    canvas.width = newPortrait ? 300 : 900;
    canvas.height = newPortrait ? 900 : 550;

    ctx.putImageData(image, 0, 0);
  };

  return (
    <>
    <header className="navbar">
          <div className="logo">
            <span className="logoIcon">✨</span>
            <span className="logoText">Squiggles</span>
          </div>
    
          <div className="rightSection">
            <nav className="navLinks">
              <a href="#"><FaPaintBrush /> Draw Squiggles</a>
              <a href="#"><FaGlobe /> Public Gallery</a>
              <a href="#"><FaNewspaper /> News</a>
              <a href="#"><FaImages /> My Gallery</a>
              <span className="history"><FaHistory /></span>
            </nav>
    
            <div className="actions">
              <button onClick={toggleTheme} className="iconButton">
                {darkMode ? <FaMoon /> : <FaSun />}
              </button>
    
              <div className="notification">
                <FaBell />
                <span className="badge">1</span>
              </div>
    
              <div className="profile">M</div>
            </div>
          </div>
        </header>



        <div className="draw-wrapper">
      <div className="top-dark">
        <div className="header-box">
          <h2 className="title">Let's Draw Some Squiggles!</h2>
          <p className="subtitle">Unleash your imagination on the canvas below.</p>
        </div>
      </div>

      <div className="middle-light">
        <div className="color-palette-horizontal">
          {colors.map((c, i) => (
            <div
              key={i}
              className={`color-circle ${color === c ? "active" : ""}`}
              style={{ backgroundColor: c }}
              onClick={() => {
                setColor(c);
                setIsErasing(false);
                setSelectedShape(null);
              }}
            ></div>
          ))}
        </div>

        <div className="tools-center">
          <div className="toolbar">
            <Button
              variant={!isErasing ? "info" : "outline-dark"}
              className="tool-btn"
              onClick={() => {
                setIsErasing(false);
                setSelectedShape(null);
              }}
            >
              ✏️
            </Button>

            <Button className="tool-btn hover-blue"><FaBrush /></Button>
            <Button className="tool-btn hover-blue"><GiEyedropper /></Button>

            <Dropdown className="shape-dropdown">
              <Dropdown.Toggle as="div" className="tool-btn hover-blue shape-toggle">
                <RiShapesFill />
              </Dropdown.Toggle>
              <Dropdown.Menu className="shape-menu">
                <Dropdown.Item onClick={() => setSelectedShape("rectangle")}>
                  <RiCheckboxBlankFill className="me-2" /> Rectangle
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedShape("circle")}>
                  <BsCircleFill className="me-2" /> Circle
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedShape("line")}>
                  <RxSlash className="me-2" /> Line
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <span className="brush-size">Size: {size}px</span>
            <Form.Range
              min={1}
              max={20}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="range-slider"
            />

            <Button className="tool-btn hover-blue" onClick={toggleOrientation}>
              <MdCropLandscape />
              <span style={{ marginLeft: "4px" }}>
                {isPortrait ? "To Landscape" : "To Portrait"}
              </span>
            </Button>

            <Button
              className="tool-btn hover-blue"
              onClick={() => {
                setIsErasing(true);
                setSelectedShape(null);
              }}
              variant={isErasing ? "danger" : "outline-dark"}
            >
              Eraser
            </Button>
          </div>

          <div className="dropdown-row">
            <Dropdown className="custom-dropdown">
              <Dropdown.Toggle variant="dark" className="custom-toggle">
                <FaMagic /> Surprise Me!
              </Dropdown.Toggle>
              <Dropdown.Menu className="custom-menu">
                <Dropdown.Item>Spooky Cute Friends</Dropdown.Item>
                <Dropdown.Item>Underwater World</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="action-buttons">
            <label htmlFor="imageUpload" className="icon-btn upload-btn">
              <RiImageAddLine />
            </label>
            <input
              type="file"
              accept="image/*"
              id="imageUpload"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
            <Button variant="outline-danger" className="icon-btn delete-btn" onClick={clearCanvas}>
              <FaTrashAlt />
            </Button>
          </div>

          <div className="canvas-row" style={{ width: "90%", padding: "10px 0" }}>
            <canvas
              ref={canvasRef}
              width={isPortrait ? 300 : 900}
              height={isPortrait ? 900 : 550}
              className="drawing-canvas"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              style={{
                border: "2px solid skyblue",
                width: isPortrait ? "380px" : "800px",
                height: isPortrait ? "800px" : "550px"
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="bottom-dark"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          padding: "40px 0",
        }}
      >
        <Button
          id="addBtn"
          style={{ marginLeft: "50px" }}
          onClick={handleFocusClick}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "yellow";
            e.target.style.color = "#0C141D";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#0C141D";
            e.target.style.color = "white";
          }}
        >
          <LuFocus /> Focus Mode
        </Button>

        <Button
          id="delBtn"
          style={{
            marginRight: "50px",
            backgroundColor: "yellow",
            border: "1px solid yellow",
            color: "#0C141D",
            borderRadius: "15px",
            padding: "10px 20px",
            fontWeight: "bold",
          }}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          <BsStars style={{ marginRight: "8px" }} />
          Make it Real
        </Button>
      </div>
    </div>
        <footer class="main-footer">
        <div class="footer-top">
            <div class="footer-left">
                <p>&copy; 2025 Squiggles. All rights reserved.</p>
                <p>Turn your imagination into magic!</p>
            </div>
            <div class="footer-right">
                <div class="social-icons">
                    <a href="#" aria-label="Twitter"><CiTwitter /></a>
                    <a href="#" aria-label="Instagram"><CiFacebook /></a>
                    <a href="#" aria-label="YouTube"><AiOutlineYoutube /></a>
                </div>
            </div>
        </div>
        
        <div class="footer-divider"></div>
        
        <div class="footer-bottom">
            <div class="footer-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
            </div>
        </div>
    </footer>
    </>

  );
};

export default DrawingSection;
