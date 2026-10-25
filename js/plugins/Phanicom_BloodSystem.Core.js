/* MAINTAINER GUIDE
 * Selected original Phanicom_BloodSystem equations/parsers. MZ engine services are replaced by the native host. The unchanged original is in reference/.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
/* Original regular and synth particle equations from BloodSystem 1.0.1. */
(function(root){
  const p=root.PhanicomPluginSettings.blood;
  const cfg={
    regularColor:p.regularColor||"#CC0000",creamColor:p.creamColor||"#F5F5DC",regularDuration:Number(p.regularDuration||30),creamDuration:Number(p.creamDuration||35),regularFade:Number(p.regularFade||.05),creamFade:Number(p.creamFade||.05),spraySize:Number(p.spraySize||1),particleSize:Number(p.particleSize||1),viscosity:Number(p.viscosity||.98),glow:p.glow!=="false"
  }
  ;
  const bloodColor=cfg.regularColor,defaultDuration=cfg.regularDuration,fadeOutSpeed=cfg.regularFade;
  class BloodParticle {
    constructor(x, y, color = bloodColor, duration = defaultDuration) {
      this.startX = x;
      this.startY = y;
      this.x = x;
      this.y = y;
      this.velocityX = (Math.random() - 0.5) * 8;
      this.velocityY = (Math.random() - 0.5) * 8;
      this.gravity = 0.1;
      this.opacity = 1.0;
      this.life = 0;
      this.maxLife = duration + Math.random() * 15;
      this.size = 2 + Math.random() * 3;
      this.color = color;
      this.fadeSpeed = fadeOutSpeed + Math.random() * 0.02;
    }
    update() {
      this.x += this.velocityX;
      this.y += this.velocityY;
      this.velocityY += this.gravity;
      this.velocityX *= 0.98;
      this.life++;
      if (this.life > this.maxLife * 0.5) {
        this.opacity -= this.fadeSpeed;
        if (this.opacity < 0) this.opacity = 0;
      }
      if (this.life > this.maxLife * 0.7) {
        this.size *= 0.95;
      }
    }
    isDead() {
      return this.life >= this.maxLife || this.opacity <= 0;
    }
    draw(sprite) {
      if (this.opacity <= 0) return;
      const bitmap = sprite.bitmap;
// Convert world coordinates to screen coordinates
      const screenX = this.x - $gameMap.displayX() * $gameMap.tileWidth();
      const screenY = this.y - $gameMap.displayY() * $gameMap.tileHeight();
      bitmap.fillRect(
      screenX - this.size/2,
      screenY - this.size/2,
      this.size,
      this.size,
      this.color
      );
    }
  }
  const synthBloodColor=cfg.creamColor,spraySize=cfg.spraySize,particleSize=cfg.particleSize,viscosity=cfg.viscosity,glowEffect=cfg.glow;
  const SynthBloodParticle=(()=>{
    const defaultDuration=cfg.creamDuration,fadeOutSpeed=cfg.creamFade;
    class SynthBloodParticle {
      constructor(x, y, color = synthBloodColor, customSpraySize = spraySize, duration = defaultDuration) {
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
// Base velocity similar to original blood spray but with synth parameters
        const baseVelocityX = 8;
        const baseVelocityY = 8;
        const velocityMultiplier = Math.max(0.5, customSpraySize);
        this.velocityX = (Math.random() - 0.5) * baseVelocityX * velocityMultiplier;
        this.velocityY = (Math.random() - 0.5) * baseVelocityY * velocityMultiplier;
        this.gravity = Math.max(0.1, 0.1 * Math.sqrt(customSpraySize));
        this.opacity = 1.0;
        this.life = 0;
// Life similar to original but with some synth enhancement
        this.maxLife = duration + Math.random() * 15 + (customSpraySize * 1.5);
// Base particle size similar to original blood spray
        const baseSize = 2 + Math.random() * 3;
        const sizeMultiplier = particleSize * Math.sqrt(customSpraySize);
        this.size = Math.max(1, baseSize * sizeMultiplier);
        this.color = color;
        this.fadeSpeed = fadeOutSpeed + Math.random() * 0.02;
        this.glowing = glowEffect;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.sprayMultiplier = customSpraySize;
      }
      update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.velocityY += this.gravity;
// Friction similar to original blood spray but with viscosity parameter
        this.velocityX *= viscosity;
        this.velocityY *= Math.min(0.98, viscosity + 0.01);
        this.life++;
        this.pulsePhase += 0.1;
// Fade timing similar to original blood spray
        if (this.life > this.maxLife * 0.5) {
          this.opacity -= this.fadeSpeed;
          if (this.opacity < 0) this.opacity = 0;
        }
// Size reduction timing similar to original
        if (this.life > this.maxLife * 0.7) {
          this.size *= 0.95;
        }
      }
      isDead() {
        return this.life >= this.maxLife || this.opacity <= 0;
      }
      draw(sprite) {
        if (this.opacity <= 0) return;
        const bitmap = sprite.bitmap;
        const screenX = this.x - $gameMap.displayX() * $gameMap.tileWidth();
        const screenY = this.y - $gameMap.displayY() * $gameMap.tileHeight();
// Draw main particle
        bitmap.fillRect(
        screenX - this.size/2,
        screenY - this.size/2,
        this.size,
        this.size,
        this.color
        );
// Enhanced glow effect for synth blood (optional enhancement)
        if (this.glowing && this.opacity > 0.2) {
          const baseGlow = 2 * Math.sqrt(this.sprayMultiplier);
          const pulseGlow = Math.sin(this.pulsePhase) * (1 * Math.sqrt(this.sprayMultiplier));
          const glowSize = this.size + baseGlow + pulseGlow;
          const glowOpacity = Math.floor((this.opacity * 0.3) * 255);
          const glowColor = this.color + ('0' + glowOpacity.toString(16)).slice(-2);
// Multiple glow layers for larger sprays
          if (this.sprayMultiplier > 3) {
            const outerGlowSize = glowSize * 1.3;
            const outerGlowOpacity = Math.floor((this.opacity * 0.15) * 255);
            const outerGlowColor = this.color + ('0' + outerGlowOpacity.toString(16)).slice(-2);
            bitmap.fillRect(
            screenX - outerGlowSize/2,
            screenY - outerGlowSize/2,
            outerGlowSize,
            outerGlowSize,
            outerGlowColor
            );
          }
          bitmap.fillRect(
          screenX - glowSize/2,
          screenY - glowSize/2,
          glowSize,
          glowSize,
          glowColor
          );
        }
      }
    }
    ;
    return SynthBloodParticle;
  }
  )();
  class ABSArcadeAudio {
    constructor() {
      try {
        this.ctx = root.PhanicomSE?.context || new (window.AudioContext || window.webkitAudioContext)();
      }
      catch (e) {
        console.warn("AudioContext not available.");
        this.ctx = null;
      }
    }
    createArcadeSound(type, duration, freqStart, freqEnd = 0, volume = 0.3) {
      if (!this.ctx) return;
      const oscillator = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const waveShaper = this.ctx.createWaveShaper();
      const curve = new Float32Array(256);
      for (let i = 0;
      i < 256;
      i++) {
        const x = (i - 128) / 128;
        curve[i] = Math.sign(x) * Math.floor(Math.abs(x) * 8) / 8;
      }
      waveShaper.curve = curve;
      oscillator.type = type;
      oscillator.frequency.value = freqStart;
      if (freqEnd > 0) {
        oscillator.frequency.linearRampToValueAtTime(freqEnd, this.ctx.currentTime + duration);
      }
      gain.gain.value = volume;
      oscillator.connect(waveShaper);
      waveShaper.connect(gain);
      gain.connect(this.ctx.destination);
      oscillator.start();
      oscillator.stop(this.ctx.currentTime + duration);
    }
// Softer, wetter squelchy blood drip sound
    playSquelchyDrip() {
      if (!this.ctx) return;
// Softer base drip sound (triangle wave with gentle pitch drop)
      const dripOsc = this.ctx.createOscillator();
      dripOsc.type = "triangle";
// Softer wave type
      dripOsc.frequency.setValueAtTime(60, this.ctx.currentTime);
// Lower start frequency
      dripOsc.frequency.linearRampToValueAtTime(30, this.ctx.currentTime + 0.5);
// Slower, lower drop
      const dripGain = this.ctx.createGain();
      dripGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
// Lower volume
      dripGain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 0.4);
// Smoother decay
      dripGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
// Wetter squelch effect (longer noise burst with low-pass filter)
      const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.3, this.ctx.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let i = 0;
      i < noiseData.length;
      i++) {
        noiseData[i] = Math.random() * 0.5 - 0.25;
// Reduced amplitude for softer noise
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = "lowpass";
      noiseFilter.frequency.setValueAtTime(400, this.ctx.currentTime);
// Lower starting frequency
      noiseFilter.frequency.linearRampToValueAtTime(200, this.ctx.currentTime + 0.3);
// Slower sweep
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
// Lower amplitude
      noiseGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
// Connect and play
      dripOsc.connect(dripGain);
      dripGain.connect(this.ctx.destination);
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      dripOsc.start();
      dripOsc.stop(this.ctx.currentTime + 0.5);
      noise.start();
      noise.stop(this.ctx.currentTime + 0.3);
    }
  }
  ;
  root.PhanicomBloodCore={
    BloodParticle,SynthBloodParticle,ABSArcadeAudio,cfg
  }
  ;
}
)(window);
