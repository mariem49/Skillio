import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
    selector: 'app-auth-layout',
    standalone: true,
    imports: [RouterOutlet, RouterLink],
    template: `
    <div class="auth-layout">
      <!-- Left Panel -->
      <div class="left-panel">
        <div class="brand">
          <div class="logo-circle">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 9C6 9 8 5 12 5C16 5 18 9 18 9" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <!-- S-like stylized shape -->
              <path d="M16 7C16 7 14 3 10 5C6 7 8 13 12 15C16 17 18 21 14 22C10 23 7 19 7 19" stroke="white" stroke-width="3" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="logo-text">Skillio</span>
        </div>

        <div class="hero-content">
          <!-- Animated Shapes -->
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>

          <div class="quote-block">
             <div class="dots-grid">
               <span></span><span></span><span></span><span></span>
             </div>
             <h1>Shape your future with the right skills</h1>
             
             <div class="testimonial-card">
               <div class="testimonial-header">
                 <img src="https://i.pravatar.cc/150?img=32" alt="Avatar" class="avatar">
                 <div>
                   <div class="name">Sarah Jenkins</div>
                   <div class="role">Product Designer</div>
                 </div>
                 <div class="stars">
                   ★★★★★
                 </div>
               </div>
               <p class="quote">"Skillio transformed my career. The quality of courses and instructors is unmatched."</p>
             </div>
          </div>
        </div>

        <div class="stats-row">
           <div class="stat-item">
             <div class="stat-num">50K+</div>
             <div class="stat-label">Students</div>
           </div>
           <div class="stat-item">
             <div class="stat-num">200+</div>
             <div class="stat-label">Courses</div>
           </div>
           <div class="stat-item">
             <div class="stat-num">98%</div>
             <div class="stat-label">Satisfaction</div>
           </div>
        </div>
      </div>

      <!-- Right Panel -->
      <div class="right-panel">
        <a routerLink="/" class="back-link">← Back to Skillio</a>
        <div class="auth-content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .auth-layout {
      display: grid;
      grid-template-columns: 40% 60%;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
    }

    /* Left Panel */
    .left-panel {
      background: linear-gradient(145deg, #4C1D95 0%, #6C3FC5 45%, #A855F7 100%);
      padding: 48px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
      color: white;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 10;
    }

    .logo-circle {
      width: 32px;
      height: 32px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo-circle svg { width: 18px; height: 18px; stroke: var(--c-primary); }

    .logo-text {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 700;
      font-size: 20px;
    }

    .hero-content {
      position: relative;
      z-index: 10;
    }

    .shape {
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.05);
      z-index: 0;
    }
    .shape-1 { width: 200px; height: 200px; top: -50px; left: -50px; animation: float-1 4s ease-in-out infinite; }
    .shape-2 { width: 150px; height: 150px; top: 50px; right: 20px; animation: float-2 6s ease-in-out infinite; animation-delay: 1s; }
    .shape-3 { width: 100px; height: 100px; bottom: -20px; left: 100px; animation: float-3 5s ease-in-out infinite; animation-delay: 2s; }

    .quote-block h1 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800;
      font-size: 32px; /* Adjusted slightly up */
      line-height: 1.3;
      margin-bottom: 32px;
    }

    .dots-grid {
      display: grid;
      grid-template-columns: repeat(2, 8px);
      gap: 6px;
      margin-bottom: 24px;
      opacity: 0.6;
    }
    .dots-grid span {
      width: 8px; height: 8px; background: white; border-radius: 50%;
    }

    .testimonial-card {
      background: rgba(255,255,255,0.08);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 14px;
      padding: 20px;
      margin-top: 20px;
    }

    .testimonial-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .avatar {
      width: 40px; height: 40px; border-radius: 50%; border: 2px solid white;
    }

    .name { font-weight: 700; font-size: 14px; }
    .role { font-size: 12px; opacity: 0.7; }
    .stars { margin-left: auto; color: #FCD34D; letter-spacing: 2px; font-size: 12px; }

    .quote {
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      font-style: italic;
      opacity: 0.85;
      line-height: 1.5;
    }

    .stats-row {
      display: flex;
      justify-content: space-around;
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 24px;
    }
    .stat-item { text-align: center; }
    .stat-num { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 22px; }
    .stat-label { font-size: 12px; opacity: 0.7; text-transform: uppercase; letter-spacing: 1px; }

    /* Right Panel */
    .right-panel {
      background: white;
      position: relative;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }

    .back-link {
      position: absolute;
      top: 24px;
      right: 24px;
      font-size: 14px;
      color: var(--c-primary);
      text-decoration: none;
      font-weight: 500;
      z-index: 20;
    }
    .back-link:hover { text-decoration: underline; }

    .auth-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 40px;
    }

    @media (max-width: 768px) {
      .auth-layout { grid-template-columns: 1fr; }
      .left-panel { display: none; }
    }
  `]
})
export class AuthLayoutComponent { }
