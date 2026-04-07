// Api/controllers/resumeController.js
const PDFDocument = require("pdfkit");
const Resume = require("../models/Resume");
const { sendResumeEmail } = require("../services/mail");

// 1. Controller for DOWNLOADING the PDF
const generateResume = async (req, res) => {
  try {
    const { userName, dob, email, phone, address, summary, education, experience, projects, skills } = req.body;

    // Save to DB
    const newResume = new Resume({
      userName, dob, email, phone, address, summary, education, experience, projects, skills,
    });
    await newResume.save();

    // Password
    const formattedName = userName.replace(/\s+/g, "");
    const userPassword = `${formattedName}-${dob}`; // [cite: 30]

    const doc = new PDFDocument({
      bufferPages: true,
      userPassword,
      ownerPassword: "admin-password",
      permissions: { printing: "high", modifying: false }, // [cite: 27]
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    }); // [cite: 26]

    res.setHeader("Content-disposition", `attachment; filename="${formattedName}_resume.pdf"`);
    res.setHeader("Content-type", "application/pdf");

    doc.pipe(res);

    // Header
    doc.fontSize(28).font("Helvetica-Bold").text(userName.toUpperCase(), { align: "center" });
    doc.moveDown(0.5);

    const contactInfo = [email, phone, address].filter(Boolean).join(" • ");
    if (contactInfo) {
      doc.fontSize(10).text(contactInfo, { align: "center" });
    }
    doc.moveDown(1.5);

    const drawSection = (title, content) => {
      if (!content) return;
      if (doc.y > doc.page.height - 100) doc.addPage();
      doc.fontSize(14).font("Helvetica-Bold").text(title.toUpperCase());
      doc.moveDown(0.5);
      doc.fontSize(11).font("Helvetica").text(content, { lineGap: 4 });
      doc.moveDown(1.5);
    };

    drawSection("Summary", summary);
    drawSection("Experience", experience);
    drawSection("Education", education);
    drawSection("Projects", projects);
    drawSection("Skills", skills);

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating PDF" });
  }
};

// 2. Controller for EMAILING the PDF 
const emailResume = async (req, res) => {
  try {
    const { userName, dob, email, phone, address, summary, education, experience, projects, skills } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required to send the resume." });
    }

    // Generate Password format: UserName-DOB [cite: 30]
    const formattedName = userName.replace(/\s+/g, "");
    const userPassword = `${formattedName}-${dob}`;

    // Create a new PDF document [cite: 26]
    const doc = new PDFDocument({
      bufferPages: true,
      userPassword,
      ownerPassword: "admin-password",
      permissions: { printing: "high", modifying: false }, // [cite: 27]
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });

    // Capture the PDF in memory (Buffer) instead of sending it to the user's browser
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    
    // When the PDF is fully generated, send the email
    doc.on("end", async () => {
      const pdfData = Buffer.concat(buffers);

      try {
        // Send email with PDF attachment [cite: 34, 35, 36]
        await sendResumeEmail(email, userName, userPassword, pdfData, formattedName);
        res.status(200).json({ message: "Email sent successfully!" });
      } catch (error) {
        console.error("Email Error:", error);
        res.status(500).json({ message: "Failed to send email" });
      }
    });

    // --- Same Layout Design as Download ---
    doc.fontSize(28).font("Helvetica-Bold").text(userName.toUpperCase(), { align: "center" });
    doc.moveDown(0.5);

    const contactInfo = [email, phone, address].filter(Boolean).join(" • ");
    if (contactInfo) {
      doc.fontSize(10).text(contactInfo, { align: "center" });
    }
    doc.moveDown(1.5);

    const drawSection = (title, content) => {
      if (!content) return;
      if (doc.y > doc.page.height - 100) doc.addPage();
      doc.fontSize(14).font("Helvetica-Bold").text(title.toUpperCase());
      doc.moveDown(0.5);
      doc.fontSize(11).font("Helvetica").text(content, { lineGap: 4 });
      doc.moveDown(1.5);
    };

    drawSection("Summary", summary);
    drawSection("Experience", experience);
    drawSection("Education", education);
    drawSection("Projects", projects);
    drawSection("Skills", skills);

    // Finalize the PDF document, which triggers the 'end' event above
    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing email request" });
  }
};

module.exports = { generateResume, emailResume };