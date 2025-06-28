import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, PlayCircle, PauseCircle, Volume2, FastForward, Rewind, Info } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';

const AudioTutorial = () => {
  const { speak } = useAccessibility();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const tutorialTracks = [
    {
      title: 'Introducción a la Accesibilidad en la App',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Audio de ejemplo
      description: 'Descubre cómo nuestra aplicación está diseñada para ser accesible para todos, especialmente para usuarios con discapacidad visual y daltonismo.',
    },
    {
      title: 'Navegación por Voz: Comandos Básicos',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', // Audio de ejemplo
      description: 'Aprende los comandos de voz esenciales para navegar por la aplicación, buscar restaurantes y productos.',
    },
    {
      title: 'Uso del Panel de Accesibilidad',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', // Audio de ejemplo
      description: 'Explora cómo ajustar el tamaño de fuente, cambiar los modos de color y gestionar el asistente de voz desde el panel de accesibilidad.',
    },
    {
      title: 'Realizar un Pedido con Asistencia',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', // Audio de ejemplo
      description: 'Guía paso a paso para seleccionar productos, añadirlos al carrito y completar tu pedido usando las funciones de accesibilidad.',
    },
  ];

  useEffect(() => {
    speak('Página de tutorial de audio. Aquí puedes escuchar guías sobre cómo usar la aplicación.');
  }, [speak]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;

      const setAudioData = () => {
        setDuration(audio.duration);
        setProgress(audio.currentTime);
      };

      const setAudioTime = () => {
        setProgress(audio.currentTime);
      };

      audio.addEventListener('loadeddata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);
      audio.addEventListener('ended', handleTrackEnd);

      return () => {
        audio.removeEventListener('loadeddata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('ended', handleTrackEnd);
      };
    }
  }, [currentTrackIndex, volume]); // Dependencias para re-renderizar en cambio de pista o volumen

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
        speak('Audio pausado.');
      } else {
        audio.play();
        speak('Reproduciendo audio.');
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    speak(`Volumen cambiado a ${Math.round(newVolume * 100)} por ciento.`);
  };

  const handleProgressChange = (e) => {
    const newProgress = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newProgress;
      setProgress(newProgress);
    }
  };

  const handleNextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % tutorialTracks.length;
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(false); // Pausar para que el usuario pueda iniciar
    speak(`Pasando a la siguiente pista: ${tutorialTracks[nextIndex].title}`);
  };

  const handlePrevTrack = () => {
    const prevIndex = (currentTrackIndex - 1 + tutorialTracks.length) % tutorialTracks.length;
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(false); // Pausar para que el usuario pueda iniciar
    speak(`Volviendo a la pista anterior: ${tutorialTracks[prevIndex].title}`);
  };

  const handleTrackEnd = () => {
    setIsPlaying(false);
    speak(`Pista ${tutorialTracks[currentTrackIndex].title} ha terminado.`);
    // Opcional: auto-play next track
    // handleNextTrack();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentTrack = tutorialTracks[currentTrackIndex];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link
            to="/help/voice-support"
            className="btn btn-secondary flex items-center space-x-2"
            onClick={() => speak('Volviendo a soporte por voz')}
            aria-label="Volver a la página de soporte por voz"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Soporte por Voz</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Tutorial por Audio</h1>
        </div>

        {/* Audio Player */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Reproductor de Tutoriales</h2>

          <div className="mb-4">
            <p className="text-lg font-medium text-gray-800" aria-live="polite">
              <span className="sr-only">Pista actual:</span>
              {currentTrack.title}
            </p>
            <p className="text-sm text-gray-600">{currentTrack.description}</p>
          </div>

          <audio ref={audioRef} src={currentTrack.src} preload="metadata"></audio>

          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={handlePrevTrack}
              className="btn p-2 rounded-full bg-gray-200 hover:bg-gray-300"
              aria-label="Pista anterior"
              title="Pista anterior"
            >
              <Rewind className="h-6 w-6 text-gray-700" />
            </button>
            <button
              onClick={togglePlayPause}
              className="btn p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700"
              aria-label={isPlaying ? 'Pausar tutorial' : 'Reproducir tutorial'}
              title={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? <PauseCircle className="h-8 w-8" /> : <PlayCircle className="h-8 w-8" />}
            </button>
            <button
              onClick={handleNextTrack}
              className="btn p-2 rounded-full bg-gray-200 hover:bg-gray-300"
              aria-label="Siguiente pista"
              title="Siguiente pista"
            >
              <FastForward className="h-6 w-6 text-gray-700" />
            </button>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <span className="text-sm text-gray-600">{formatTime(progress)}</span>
            <input
              type="range"
              min="0"
              max={duration}
              value={progress}
              onChange={handleProgressChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
              aria-label="Control de progreso del audio"
            />
            <span className="text-sm text-gray-600">{formatTime(duration)}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Volume2 className="h-5 w-5 text-gray-600" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm"
              aria-label="Control de volumen del audio"
            />
          </div>
        </div>

        {/* Lista de Tutoriales */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Lista de Tutoriales Disponibles</h2>
          <div className="space-y-4">
            {tutorialTracks.map((track, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentTrackIndex(index);
                  setIsPlaying(false); // Pausar para que el usuario pueda iniciar
                  speak(`Cargando tutorial: ${track.title}`);
                }}
                className={`flex flex-col items-start p-4 border rounded-lg w-full text-left 
                  ${index === currentTrackIndex ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:bg-gray-100'}
                `}
                aria-label={`Seleccionar tutorial ${track.title}. ${index === currentTrackIndex ? 'Actualmente seleccionado.' : ''}`}
              >
                <span className={`font-semibold ${index === currentTrackIndex ? 'text-blue-700' : 'text-gray-900'}`}>
                  {index + 1}. {track.title}
                </span>
                <span className="text-sm text-gray-600 mt-1">{track.description}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioTutorial; 