import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Transporter SMTP compatible con Vercel + Gmail App Password
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, 
      auth: {
        user: "arle.n8n@gmail.com",//process.env.EMAIL_USER,
        pass: "xeviwixjjffzlerm"//process.env.EMAIL_PASS, // SIN ESPACIOS EN LA APP PASSWORD
      },
    });

    // Verifica conexión SMTP (opcional pero muy útil al depurar)
    await transporter.verify();

    const mailOptions = {
      from: `"Bosque Vivo HN" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Activación de cuenta - Bosque Vivo HN 🌳',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>🌿 Bienvenido al Sistema Bosque Vivo HN</h2>
          <p>Su registro ha sido validado exitosamente.</p>
          <p><b>Credenciales temporales:</b></p>
          <ul>
            <li><b>Usuario:</b> ${email}</li>
            <li><b>Contraseña:</b> ${password}</li>
          </ul>
          <p>Le recomendamos cambiar su contraseña al iniciar sesión por primera vez.</p>
          <hr/>
          <p style="font-size: 0.9em; color: #777;">
            Este mensaje fue generado automáticamente por el sistema de registro Bosque Vivo HN.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error enviando correo:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      details: error,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
