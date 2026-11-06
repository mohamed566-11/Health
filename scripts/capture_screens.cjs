const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const distDir = path.resolve(__dirname, '..', 'dist');
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.wav': 'audio/wav',
};

const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url, 'http://localhost:3456');
  let filePath = path.join(distDir, urlObj.pathname === '/' ? 'index.html' : urlObj.pathname);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(distDir, 'index.html');
  }
  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  if (filePath.endsWith('index.html')) {
    let html = fs.readFileSync(filePath, 'utf8');
    const role = urlObj.searchParams.get('role');
    const openVideo = urlObj.searchParams.get('video');
    const theatre = urlObj.searchParams.get('theatre');
    
    let injectedScripts = '';
    if (role) {
      const sessions = {
        patient: { id: 'pat-1', role: 'patient', name: 'أحمد محمد', phone: '01012345678' },
        doctor: { id: 'doc-1', role: 'doctor', name: 'د. أحمد محمود', specialty: 'قلب وأوعية دموية', clinicId: 'clinic-1' },
        nurse: { id: 'nurse-1', role: 'nurse', name: 'منى إبراهيم', clinicId: 'clinic-1' },
        admin: { id: 'admin-1', role: 'admin', name: 'Platform Administrator' }
      };
      if (sessions[role]) {
        injectedScripts += `try { localStorage.setItem('maw3edy:v1:session', JSON.stringify(${JSON.stringify(sessions[role])})); } catch(e){}\n`;
      }
    }
    if (openVideo) {
      injectedScripts += `
        window.addEventListener('DOMContentLoaded', () => {
          setTimeout(() => {
            const btn = document.querySelector('button[aria-label*="فيديو"], button:has(svg.lucide-play-circle), button:has(svg.lucide-play)');
            const videoBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && (b.textContent.includes('فيديو الشرح') || b.textContent.includes('شاهد الفيديو') || b.textContent.includes('تشغيل الفيديو')));
            if (videoBtn) videoBtn.click();
            else if (btn) btn.click();
            ${theatre ? `setTimeout(() => {
              const thBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('تكبير الشاشة'));
              if (thBtn) thBtn.click();
            }, 600);` : ''}
          }, 800);
        });
      `;
    }

    if (injectedScripts) {
      html = html.replace('</head>', `<script>${injectedScripts}</script></head>`);
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } else {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end();
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      }
    });
  }
});

function runChrome(url, width, height, targetFile) {
  return new Promise((resolve, reject) => {
    const tmpOut = path.join(os.tmpdir(), `screen_${Date.now()}_${Math.random().toString(36).slice(2)}.png`);
    const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
      '--headless',
      '--disable-gpu',
      `--window-size=${width},${height}`,
      '--hide-scrollbars',
      `--screenshot=${tmpOut}`,
      '--virtual-time-budget=2500',
      url
    ]);
    chrome.on('close', (code) => {
      if (fs.existsSync(tmpOut)) {
        fs.mkdirSync(path.dirname(targetFile), { recursive: true });
        fs.copyFileSync(tmpOut, targetFile);
        fs.unlinkSync(tmpOut);
        resolve(true);
      } else {
        resolve(false);
      }
    });
    chrome.on('error', reject);
  });
}

const routes = [
  // Public
  { name: 'login', path: '/login', role: null },
  { name: 'register', path: '/register', role: null },
  { name: 'onboarding', path: '/onboarding', role: null },
  { name: 'dev_ui', path: '/dev/ui', role: null },
  // Patient
  { name: 'patient_home', path: '/patient', role: 'patient' },
  { name: 'patient_video_modal', path: '/patient?video=1', role: 'patient' },
  { name: 'patient_video_theatre', path: '/patient?video=1&theatre=1', role: 'patient' },
  { name: 'patient_doctors', path: '/patient/doctors', role: 'patient' },
  { name: 'patient_doctor_profile', path: '/patient/doctors/doc-1', role: 'patient' },
  { name: 'patient_booking', path: '/patient/booking/doc-1', role: 'patient' },
  { name: 'patient_confirmation', path: '/patient/booking-confirmation/apt-1', role: 'patient' },
  { name: 'patient_queue', path: '/patient/queue/apt-1', role: 'patient' },
  { name: 'patient_appointments', path: '/patient/appointments', role: 'patient' },
  { name: 'patient_records', path: '/patient/records', role: 'patient' },
  { name: 'patient_prescriptions', path: '/patient/prescriptions', role: 'patient' },
  { name: 'patient_prescription_view', path: '/patient/prescriptions/rx-1', role: 'patient' },
  { name: 'patient_profile', path: '/patient/profile', role: 'patient' },
  { name: 'patient_help', path: '/patient/help', role: 'patient' },
  // Doctor
  { name: 'doctor_dashboard', path: '/doctor', role: 'doctor' },
  { name: 'doctor_patients', path: '/doctor/patients', role: 'doctor' },
  { name: 'doctor_rx_new', path: '/doctor/prescriptions/new', role: 'doctor' },
  { name: 'doctor_notes', path: '/doctor/notes', role: 'doctor' },
  { name: 'doctor_clinics', path: '/doctor/clinics', role: 'doctor' },
  { name: 'doctor_schedule', path: '/doctor/schedule', role: 'doctor' },
  { name: 'doctor_visit', path: '/doctor/visit/apt-1', role: 'doctor' },
  // Nurse
  { name: 'nurse_dashboard', path: '/nurse', role: 'nurse' },
  { name: 'nurse_queue', path: '/nurse/queue', role: 'nurse' },
  { name: 'nurse_walkin', path: '/nurse/walk-in', role: 'nurse' },
  { name: 'nurse_patients', path: '/nurse/patients', role: 'nurse' },
  // Admin
  { name: 'admin_dashboard', path: '/admin', role: 'admin' },
  { name: 'admin_doctors', path: '/admin/doctors', role: 'admin' },
  { name: 'admin_patients', path: '/admin/patients', role: 'admin' },
  { name: 'admin_nurses', path: '/admin/nurses', role: 'admin' },
  { name: 'admin_clinics', path: '/admin/clinics', role: 'admin' },
  { name: 'admin_specialties', path: '/admin/specialties', role: 'admin' },
  { name: 'admin_locations', path: '/admin/locations', role: 'admin' },
  { name: 'admin_reviews', path: '/admin/reviews', role: 'admin' },
  { name: 'admin_settings', path: '/admin/settings', role: 'admin' },
];

const desktopWidths = [1024, 1280, 1440, 1920];
const mobileWidths = [360, 390, 768];

async function main() {
  const mode = process.argv[2] || 'baseline'; // 'baseline' or 'verify'
  const outDir = path.resolve(__dirname, '..', mode === 'baseline' ? '.baseline' : '.verify');
  fs.mkdirSync(outDir, { recursive: true });

  await new Promise((resolve) => server.listen(3456, resolve));
  console.log(`Server started on port 3456. Capturing screenshots to ${outDir}...`);

  const allWidths = [
    ...desktopWidths.map(w => ({ w, h: 900, type: 'desktop' })),
    ...mobileWidths.map(w => ({ w, h: w === 768 ? 1024 : 844, type: 'mobile' }))
  ];

  let successCount = 0;
  for (const r of routes) {
    for (const v of allWidths) {
      const q = r.role ? (r.path.includes('?') ? `&role=${r.role}` : `?role=${r.role}`) : '';
      const fullUrl = `http://localhost:3456${r.path}${q}`;
      const targetFile = path.join(outDir, `${r.name}_${v.w}.png`);
      try {
        const ok = await runChrome(fullUrl, v.w, v.h, targetFile);
        if (ok) {
          successCount++;
          process.stdout.write('.');
        } else {
          console.warn(`\nFailed for ${r.name} at ${v.w}px`);
        }
      } catch (err) {
        console.error(`\nError for ${r.name} at ${v.w}px:`, err.message);
      }
    }
  }

  console.log(`\nDone! Successfully captured ${successCount} screenshots.`);
  server.close();
}

main().catch(err => {
  console.error(err);
  server.close();
});

