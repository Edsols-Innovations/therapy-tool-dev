import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import home from '../assets/ListeningStudio/home.png'
import topright from '../assets/ListeningStudio/topright.png'
import bottomleft from '../assets/ListeningStudio/bottomleft.png'
import edsolslogo from '../assets/ListeningStudio/edsols.png'

import nature from '../assets/ListeningStudio/nature.png'
import household from '../assets/ListeningStudio/household.png'
import animals from '../assets/ListeningStudio/animals.png'
import humans from '../assets/ListeningStudio/humans.png'
import vehicles from '../assets/ListeningStudio/vehicles.png'
import sports from '../assets/ListeningStudio/sports.png'
import cartoons from '../assets/ListeningStudio/cartoons.png'
import music from '../assets/ListeningStudio/music.gif'

import RainImg from '../assets/ListeningStudio/Rain.png'
import ThunderImg from '../assets/ListeningStudio/Thunderstrom.png'
import BirdImg from '../assets/ListeningStudio/bird.png'
import OceanImg from '../assets/ListeningStudio/OceanWaves.png'
import WindImg from '../assets/ListeningStudio/Wind.png'
import LeavesImg from '../assets/ListeningStudio/leaves.png'
import WaterfallImg from '../assets/ListeningStudio/Waterfalls.png'
import CricketImg from '../assets/ListeningStudio/Cricket.png'
import ForestImg from '../assets/ListeningStudio/Forest.png'
import RiverImg from '../assets/ListeningStudio/River.png'

import RainSound from '../assets/ListeningStudio/sounds/Nature/rainfall.wav'
import ThunderSound from '../assets/ListeningStudio/sounds/Nature/thunderstorm.mp3'
import BirdSound from '../assets/ListeningStudio/sounds/Nature/birds.mp3'
import OceanSound from '../assets/ListeningStudio/sounds/Nature/oceanwaves.mp3'
import WindSound from '../assets/ListeningStudio/sounds/Nature/wind.mp3'
import LeavesSound from '../assets/ListeningStudio/sounds/Nature/leaves.wav'
import WaterfallSound from '../assets/ListeningStudio/sounds/Nature/waterfall.mp3'
import CricketSound from '../assets/ListeningStudio/sounds/Nature/crickets.mp3'
import ForestSound from '../assets/ListeningStudio/sounds/Nature/forest.mp3'
import RiverSound from '../assets/ListeningStudio/sounds/Nature/river.mp3'

import doorbellSound from '../assets/ListeningStudio/sounds/Household/doorbellsound.mp3'
import vacuumSound from '../assets/ListeningStudio/sounds/Household/vacuum.mp3'
import microwaveSound from '../assets/ListeningStudio/sounds/Household/microwave.mp3'
import clockSound from '../assets/ListeningStudio/sounds/Household/clock.mp3'
import washingMachineSound from '../assets/ListeningStudio/sounds/Household/washingmachine.mp3'
import blenderSound from '../assets/ListeningStudio/sounds/Household/blender.mp3'
import cookerSound from '../assets/ListeningStudio/sounds/Household/pressure-cooker.mp3'
import toiletSound from '../assets/ListeningStudio/sounds/Household/toilet.mp3'
import footstepsSound from '../assets/ListeningStudio/sounds/Household/footsteps.mp3'
import ringtoneSound from '../assets/ListeningStudio/sounds/Household/ringtone.mp3'

import doorbellImg from '../assets/ListeningStudio/bell.png'
import vacuumImg from '../assets/ListeningStudio/vaccum.png'
import microwaveImg from '../assets/ListeningStudio/oven.png'
import clockImg from '../assets/ListeningStudio/clock.png'
import washingMachineImg from '../assets/ListeningStudio/washing.png'
import blenderImg from '../assets/ListeningStudio/blender.png'
import cookerImg from '../assets/ListeningStudio/pressure-cooker.png'
import toiletImg from '../assets/ListeningStudio/toilet.png'
import footstepsImg from '../assets/ListeningStudio/walk.png'
import ringtoneImg from '../assets/ListeningStudio/call.png'

import dogSound from '../assets/ListeningStudio/sounds/Animals/dog.wav'
import catSound from '../assets/ListeningStudio/sounds/Animals/meow.mp3'
import cowSound from '../assets/ListeningStudio/sounds/Animals/cowmoos.wav'
import horseSound from '../assets/ListeningStudio/sounds/Animals/horse.mp3'
import sheepSound from '../assets/ListeningStudio/sounds/Animals/sheep.wav'
import duckSound from '../assets/ListeningStudio/sounds/Animals/ducks.mp3'
import lionSound from '../assets/ListeningStudio/sounds/Animals/lion.mp3'
import pigeonSound from '../assets/ListeningStudio/sounds/Animals/pigeon.mp3'
import elephantSound from '../assets/ListeningStudio/sounds/Animals/elephant.mp3'
import crowSound from '../assets/ListeningStudio/sounds/Animals/crow.mp3'

// Importing images
import dogImg from '../assets/ListeningStudio/dog.png'
import catImg from '../assets/ListeningStudio/cat.png'
import cowImg from '../assets/ListeningStudio/cow.png'
import horseImg from '../assets/ListeningStudio/horse.png'
import sheepImg from '../assets/ListeningStudio/sheep.png'
import DuckImg from '../assets/ListeningStudio/duck.png'
import lionImg from '../assets/ListeningStudio/lion.png'
import pigeonImg from '../assets/ListeningStudio/pigeon.png'
import elephantImg from '../assets/ListeningStudio/elephant.png'
import crowImg from '../assets/ListeningStudio/crow.png'

import laughSound from '../assets/ListeningStudio/sounds/Humans/laugh.mp3'
import sneezeSound from '../assets/ListeningStudio/sounds/Humans/sneeze.mp3'
import clapsSound from '../assets/ListeningStudio/sounds/Humans/claps.mp3'
import coughSound from '../assets/ListeningStudio/sounds/Humans/cough.mp3'
import crySound from '../assets/ListeningStudio/sounds/Humans/cry.m4a'
import yawnSound from '../assets/ListeningStudio/sounds/Humans/yawn.mp3'
import snoringSound from '../assets/ListeningStudio/sounds/Humans/snoring.mp3'
import whistleHSound from '../assets/ListeningStudio/sounds/Humans/whistle.mp3'
import hummSound from '../assets/ListeningStudio/sounds/Humans/humm.mp3'
import shoutSound from '../assets/ListeningStudio/sounds/Humans/shout.mp3'

// Importing images
import laughImg from '../assets/ListeningStudio/laugh.png'
import sneezeImg from '../assets/ListeningStudio/sneezing.png'
import clapsImg from '../assets/ListeningStudio/clapping.png'
import coughImg from '../assets/ListeningStudio/cough.png'
import cryImg from '../assets/ListeningStudio/cry.png'
import yawnImg from '../assets/ListeningStudio/yawn.png'
import snoringImg from '../assets/ListeningStudio/snooring.png'
import whistleHImg from '../assets/ListeningStudio/gw.png'
import hummImg from '../assets/ListeningStudio/humming.png'
import shoutImg from '../assets/ListeningStudio/shouting.png'

import carSound from '../assets/ListeningStudio/sounds/Vehicles/car.wav'
import bikeSound from '../assets/ListeningStudio/sounds/Vehicles/Bike.wav'
import trainSound from '../assets/ListeningStudio/sounds/Vehicles/train.mp3'
import airplaneSound from '../assets/ListeningStudio/sounds/Vehicles/airplane.mp3'
import bicycleSound from '../assets/ListeningStudio/sounds/Vehicles/bicycle.wav'
import autoSound from '../assets/ListeningStudio/sounds/Vehicles/auto.mp3'
import helicopterSound from '../assets/ListeningStudio/sounds/Vehicles/helicopter.wav'
import busSound from '../assets/ListeningStudio/sounds/Vehicles/bus.flac'
import truckSound from '../assets/ListeningStudio/sounds/Vehicles/truck.wav'
import ambulanceSound from '../assets/ListeningStudio/sounds/Vehicles/ambulance.mp3'

// Importing images
import carImg from '../assets/ListeningStudio/car.png'
import bikeImg from '../assets/ListeningStudio/bike.png'
import trainImg from '../assets/ListeningStudio/train.png'
import airplaneImg from '../assets/ListeningStudio/plane.png'
import bicycleImg from '../assets/ListeningStudio/bicyclebell.png'
import autoimg from '../assets/ListeningStudio/auto.png'
import helicopterImg from '../assets/ListeningStudio/heli.png'
import busImg from '../assets/ListeningStudio/bus.png'
import truckImg from '../assets/ListeningStudio/truck.png'
import ambulanceImg from '../assets/ListeningStudio/ambulance.png'

import whistleSound from '../assets/ListeningStudio/sounds/Sports/whistle.wav'
import crowdSound from '../assets/ListeningStudio/sounds/Sports/crowd.mp3'
import basketballSound from '../assets/ListeningStudio/sounds/Sports/basketball.mp3'
import tennisSound from '../assets/ListeningStudio/sounds/Sports/tennis.mp3'
import golfSound from '../assets/ListeningStudio/sounds/Sports/golf.mp3'
import soccerSound from '../assets/ListeningStudio/sounds/Sports/soccer.wav'
import watersplashSound from '../assets/ListeningStudio/sounds/Sports/watersplash.mp3'
import baseballSound from '../assets/ListeningStudio/sounds/Sports/bball.wav'
import boxingSound from '../assets/ListeningStudio/sounds/Sports/box.wav'
import racecarSound from '../assets/ListeningStudio/sounds/Sports/racecar.mp3'

// Importing images
import whistleImg from '../assets/ListeningStudio/whistle.png'
import crowdImg from '../assets/ListeningStudio/crowd.png'
import basketballImg from '../assets/ListeningStudio/bball.png'
import tennisImg from '../assets/ListeningStudio/tennis.png'
import golfImg from '../assets/ListeningStudio/golf.png'
import soccerImg from '../assets/ListeningStudio/fball.png'
import watersplashImg from '../assets/ListeningStudio/swim.png'
import baseballImg from '../assets/ListeningStudio/baseball.png'
import boxingImg from '../assets/ListeningStudio/boxin.png'
import racecarImg from '../assets/ListeningStudio/racecar.png'

import boingSound from '../assets/ListeningStudio/sounds/Cartoon/boing.mp3'
import slideWhistleSound from '../assets/ListeningStudio/sounds/Cartoon/sw.mp3'
import splatSound from '../assets/ListeningStudio/sounds/Cartoon/splat.mp3'
import zapSound from '../assets/ListeningStudio/sounds/Cartoon/zap.mp3'
import boinkSound from '../assets/ListeningStudio/sounds/Cartoon/boink.mp3'
import whirlSound from '../assets/ListeningStudio/sounds/Cartoon/whirl.mp3'
import honkSound from '../assets/ListeningStudio/sounds/Cartoon/honk.mp3'
import tootSound from '../assets/ListeningStudio/sounds/Cartoon/toot.mp3'
import popSound from '../assets/ListeningStudio/sounds/Cartoon/pop.mp3'
import whooshSound from '../assets/ListeningStudio/sounds/Cartoon/whoosh.mp3'

// Importing images
import boingImg from '../assets/ListeningStudio/boing.png'
import slideWhistleImg from '../assets/ListeningStudio/sw.png'
import splatImg from '../assets/ListeningStudio/splat.png'
import zapImg from '../assets/ListeningStudio/zap.png'
import boinkImg from '../assets/ListeningStudio/boink.png'
import whirlImg from '../assets/ListeningStudio/whirl.png'
import honkImg from '../assets/ListeningStudio/honk.png'
import tootImg from '../assets/ListeningStudio/toot.png'
import popImg from '../assets/ListeningStudio/pop.png'
import whooshImg from '../assets/ListeningStudio/whoosh.png'

import mouthorganSound from '../assets/ListeningStudio/sounds/Music/mouthorgan.mp3'
import thavilSound from '../assets/ListeningStudio/sounds/Music/thavil.mp3'
import pianoSound from '../assets/ListeningStudio/sounds/Music/piano.mp3'
import drumsSound from '../assets/ListeningStudio/sounds/Music/drums.mp3'
import guitarSound from '../assets/ListeningStudio/sounds/Music/guitar.mp3'
import violinSound from '../assets/ListeningStudio/sounds/Music/violin.mp3'
import shenaiSound from '../assets/ListeningStudio/sounds/Music/shenai.mp3'
import fluteSound from '../assets/ListeningStudio/sounds/Music/flute.mp3'
import veenaSound from '../assets/ListeningStudio/sounds/Music/veena.mp3'
import tablaSound from '../assets/ListeningStudio/sounds/Music/tabla.mp3'

import mouthorganImg from '../assets/ListeningStudio/mouthorgan.png'
import thavilImg from '../assets/ListeningStudio/thavil.png'
import pianoImg from '../assets/ListeningStudio/piano.png'
import drumsImg from '../assets/ListeningStudio/drums.png'
import guitarImg from '../assets/ListeningStudio/guitar.png'
import violinImg from '../assets/ListeningStudio/violin.png'
import shenaiImg from '../assets/ListeningStudio/shenai.png'
import fluteImg from '../assets/ListeningStudio/flute.png'
import veenaImg from '../assets/ListeningStudio/veena.png'
import tablaImg from '../assets/ListeningStudio/tabla.png'

type GridItem = {
  id: number
  text: string
  imageSrc: string
}

const items: GridItem[] = [
  { id: 1, text: 'Nature', imageSrc: nature },
  { id: 2, text: 'Household', imageSrc: household },
  { id: 3, text: 'Animals', imageSrc: animals },
  { id: 4, text: 'Humans', imageSrc: humans },
  { id: 5, text: 'Vehicles', imageSrc: vehicles },
  { id: 6, text: 'Sports', imageSrc: sports },
  { id: 7, text: 'Music', imageSrc: music },
  { id: 8, text: 'Cartoons', imageSrc: cartoons }
]

const Listeningstudio = () => {
  const [selectedItem, setSelectedItem] = useState<GridItem | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeButton, setActiveButton] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setActiveButton(null); // Reset active button when item changes
  }, [selectedItem]);

  // Cleanup effect to stop audio when the component unmounts or exits
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null; // Reset the ref to ensure cleanup
      }
    };
  }, []); // Empty dependency array ensures this runs on unmount

  const toggleSound = (soundFile: string, buttonId: number) => {
    if (audioRef.current && isPlaying && activeButton === buttonId) {
      // Pause the current audio
      audioRef.current.pause();
      setIsPlaying(false);
      setActiveButton(null); // Reset the active button
    } else {
      // Pause and reset any currently playing audio before playing new one
      if (audioRef.current) {
        audioRef.current.pause();
      }
      // Create a new audio object for the new sound
      audioRef.current = new Audio(soundFile);
      audioRef.current.play();
      setIsPlaying(true);
      setActiveButton(buttonId); // Set the active button
    }
  };


  const renderButtonsForId = (id: number) => {
    const buttonClass =
      'flex flex-col items-center justify-center bg-white-200 text-black font-bold text-xl rounded-lg w-40 h-40 p-2 rounded-xl'
    const imageClass = 'h-27 w-25 mb-2'

    switch (id) {
      case 1: // Nature
        return (
          <>
            <div className="grid grid-cols-5 gap-20">
              <button
                onClick={() => toggleSound(RainSound, 1)}
                className={`${buttonClass} ${activeButton === 1 ? 'bg-gray-300' : ''}`}
              >
                <img src={RainImg} alt="Rain" className={imageClass} />
                <span>Rainfall</span>
              </button>
              <button
                onClick={() => toggleSound(ThunderSound, 2)}
                className={`${buttonClass} ${activeButton === 2 ? 'bg-gray-300' : ''}`}
              >
                <img src={ThunderImg} alt="Thunder" className={imageClass} />
                <span>Thunderstorm</span>
              </button>
              <button
                onClick={() => toggleSound(BirdSound, 3)}
                className={`${buttonClass} ${activeButton === 3 ? 'bg-gray-300' : ''}`}
              >
                <img src={BirdImg} alt="Birds" className={imageClass} />
                <span className="ml-[-7%]">Birds chirping</span>
              </button>
              <button
                onClick={() => toggleSound(OceanSound, 4)}
                className={`${buttonClass} ${activeButton === 4 ? 'bg-gray-300' : ''}`}
              >
                <img src={OceanImg} alt="Ocean" className={imageClass} />
                <span>Ocean waves</span>
              </button>
              <button
                onClick={() => toggleSound(WindSound, 5)}
                className={`${buttonClass} ${activeButton === 5 ? 'bg-gray-300' : ''}`}
              >
                <img src={WindImg} alt="Wind" className={imageClass} />
                <span>Wind blowing</span>
              </button>
              <button
                onClick={() => toggleSound(LeavesSound, 6)}
                className={`${buttonClass} ${activeButton === 6 ? 'bg-gray-300' : ''}`}
              >
                <img src={LeavesImg} alt="Leaves" className={imageClass} />
                <span>Rustling leaves</span>
              </button>
              <button
                onClick={() => toggleSound(WaterfallSound, 7)}
                className={`${buttonClass} ${activeButton === 7 ? 'bg-gray-300' : ''}`}
              >
                <img src={WaterfallImg} alt="Waterfall" className={imageClass} />
                <span>Waterfall</span>
              </button>
              <button
                onClick={() => toggleSound(CricketSound, 8)}
                className={`${buttonClass} ${activeButton === 8 ? 'bg-gray-300' : ''}`}
              >
                <img src={CricketImg} alt="Crickets" className={imageClass} />
                <span>Crickets</span>
              </button>
              <button
                onClick={() => toggleSound(ForestSound, 9)}
                className={`${buttonClass} ${activeButton === 9 ? 'bg-gray-300' : ''}`}
              >
                <img src={ForestImg} alt="Forest" className={imageClass} />
                <span>Forest ambiance</span>
              </button>
              <button
                onClick={() => toggleSound(RiverSound, 10)}
                className={`${buttonClass} ${activeButton === 10 ? 'bg-gray-300' : ''}`}
              >
                <img src={RiverImg} alt="River" className={imageClass} />
                <span>River flowing</span>
              </button>
            </div>
          </>
        )

      case 2: // Household
        return (
          <>
            <div className="grid grid-cols-5 gap-20">
              <button
                onClick={() => toggleSound(doorbellSound, 1)}
                className={`${buttonClass} ${activeButton === 1 ? 'bg-gray-300' : ''}`}
              >
                <img src={doorbellImg} alt="Doorbell" className={imageClass} />
                <span>Doorbell</span>
              </button>
              <button
                onClick={() => toggleSound(vacuumSound, 2)}
                className={`${buttonClass} ${activeButton === 2 ? 'bg-gray-300' : ''}`}
              >
                <img src={vacuumImg} alt="Vacuum" className={imageClass} />
                <span>Vacuum Cleaner</span>
              </button>
              <button
                onClick={() => toggleSound(microwaveSound, 3)}
                className={`${buttonClass} ${activeButton === 3 ? 'bg-gray-300' : ''}`}
              >
                <img src={microwaveImg} alt="Microwave" className={imageClass} />
                <span className="ml-[-7%]">
                  Microwave <br /> Beeping
                </span>
              </button>
              <button
                onClick={() => toggleSound(clockSound, 4)}
                className={`${buttonClass} ${activeButton === 4 ? 'bg-gray-300' : ''}`}
              >
                <img src={clockImg} alt="Clock" className={imageClass} />
                <span>Clock Ticking</span>
              </button>
              <button
                onClick={() => toggleSound(washingMachineSound, 5)}
                className={`${buttonClass} ${activeButton === 5 ? 'bg-gray-300' : ''}`}
              >
                <img src={washingMachineImg} alt="Washing Machine" className={imageClass} />
                <span>Washing Machine</span>
              </button>
              <button
                onClick={() => toggleSound(blenderSound, 6)}
                className={`${buttonClass} ${activeButton === 6 ? 'bg-gray-300' : ''}`}
              >
                <img src={blenderImg} alt="Blender" className={imageClass} />
                <span>Blender</span>
              </button>
              <button
                onClick={() => toggleSound(cookerSound, 7)}
                className={`${buttonClass} ${activeButton === 7 ? 'bg-gray-300' : ''}`}
              >
                <img src={cookerImg} alt="Tap" className='w-24' />
                <span>Pressure cooker</span>
              </button>
              <button
                onClick={() => toggleSound(toiletSound, 8)}
                className={`${buttonClass} ${activeButton === 8 ? 'bg-gray-300' : ''}`}
              >
                <img src={toiletImg} alt="Toilet Flushing" className={imageClass} />
                <span>Toilet Flushing</span>
              </button>
              <button
                onClick={() => toggleSound(footstepsSound, 9)}
                className={`${buttonClass} ${activeButton === 9 ? 'bg-gray-300' : ''}`}
              >
                <img src={footstepsImg} alt="Footsteps" className={imageClass} />
                <span>Footsteps</span>
              </button>
              <button
                onClick={() => toggleSound(ringtoneSound, 10)}
                className={`${buttonClass} ${activeButton === 10 ? 'bg-gray-300' : ''}`}
              >
                <img src={ringtoneImg} alt="Call" className={imageClass} />
                <span>Telephone Ringing</span>
              </button>
            </div>
          </>
        )

      case 3: // Animals
        return (
          <>
            <div className="grid grid-cols-5 gap-20">
              <button
                onClick={() => toggleSound(dogSound, 1)}
                className={`${buttonClass} ${activeButton === 1 ? 'bg-gray-300' : ''}`}
              >
                <img src={dogImg} alt="Dog" className={imageClass} />
                <span>Dog Barking</span>
              </button>
              <button
                onClick={() => toggleSound(catSound, 2)}
                className={`${buttonClass} ${activeButton === 2 ? 'bg-gray-300' : ''}`}
              >
                <img src={catImg} alt="Cat" className={imageClass} />
                <span>Cat Meowing</span>
              </button>
              <button
                onClick={() => toggleSound(cowSound, 3)}
                className={`${buttonClass} ${activeButton === 3 ? 'bg-gray-300' : ''}`}
              >
                <img src={cowImg} alt="Cow" className="h-30 w-35 mb-2 ml-[-7%]" />
                <span className="ml-[-10%]">Cow Mooing</span>
              </button>
              <button
                onClick={() => toggleSound(horseSound, 4)}
                className={`${buttonClass} ${activeButton === 4 ? 'bg-gray-300' : ''}`}
              >
                <img src={horseImg} alt="Horse" className={imageClass} />
                <span className="ml-[2%]">Horse Neighing</span>
              </button>
              <button
                onClick={() => toggleSound(sheepSound, 5)}
                className={`${buttonClass} ${activeButton === 5 ? 'bg-gray-300' : ''}`}
              >
                <img src={sheepImg} alt="Sheep" className={imageClass} />
                <span>Sheep Bleating</span>
              </button>
              <button
                onClick={() => toggleSound(duckSound, 6)}
                className={`${buttonClass} ${activeButton === 6 ? 'bg-gray-300' : ''}`}
              >
                <img src={DuckImg} alt="duck" className= "h-20 mb-3"/>
                <span>Duck quacking</span>
              </button>
              <button
                onClick={() => toggleSound(lionSound, 7)}
                className={`${buttonClass} ${activeButton === 7 ? 'bg-gray-300' : ''}`}
              >
                <img src={lionImg} alt="Lion" className={imageClass} />
                <span>Lion Roaring</span>
              </button>
              <button
                onClick={() => toggleSound(pigeonSound, 8)}
                className={`${buttonClass} ${activeButton === 8 ? 'bg-gray-300' : ''}`}
              >
                <img src={pigeonImg} alt="Bird" className= "mb-2 h-24"/>
                <span>Pigeon</span>
              </button>
              <button
                onClick={() => toggleSound(elephantSound, 9)}
                className={`${buttonClass} ${activeButton === 9 ? 'bg-gray-300' : ''}`}
              >
                <img src={elephantImg} alt="Elephant" className={imageClass} />
                <span>Elephant Trumpeting</span>
              </button>
              <button
                onClick={() => toggleSound(crowSound, 10)}
                className={`${buttonClass} ${activeButton === 10 ? 'bg-gray-300' : ''}`}
              >
                <img src={crowImg} alt="Snake" className= "mb-2 h-24" />
                <span>Crow</span>
              </button>
            </div>
          </>
        )

      case 4: // Humans
        return (
          <>
            <div className="grid grid-cols-5 gap-20">
              <button
                onClick={() => toggleSound(laughSound, 1)}
                className={`${buttonClass} ${activeButton === 1 ? 'bg-gray-300' : ''}`}
              >
                <img src={laughImg} alt="Laughing" className={imageClass} />
                <span>Laughing</span>
              </button>
              <button
                onClick={() => toggleSound(sneezeSound, 2)}
                className={`${buttonClass} ${activeButton === 2 ? 'bg-gray-300' : ''}`}
              >
                <img src={sneezeImg} alt="Sneezing" className={imageClass} />
                <span>Sneezing</span>
              </button>
              <button
                onClick={() => toggleSound(clapsSound, 3)}
                className={`${buttonClass} ${activeButton === 3 ? 'bg-gray-300' : ''}`}
              >
                <img src={clapsImg} alt="Clapping" className="h-30 w-35 mb-2 ml-[-7%]" />
                <span className="ml-[-10%]">Clapping</span>
              </button>
              <button
                onClick={() => toggleSound(coughSound, 4)}
                className={`${buttonClass} ${activeButton === 4 ? 'bg-gray-300' : ''}`}
              >
                <img src={coughImg} alt="Coughing" className={imageClass} />
                <span className="ml-[2%]">Coughing</span>
              </button>
              <button
                onClick={() => toggleSound(crySound, 5)}
                className={`${buttonClass} ${activeButton === 5 ? 'bg-gray-300' : ''}`}
              >
                <img src={cryImg} alt="Crying" className={imageClass} />
                <span>Crying</span>
              </button>
              <button
                onClick={() => toggleSound(yawnSound, 6)}
                className={`${buttonClass} ${activeButton === 6 ? 'bg-gray-300' : ''}`}
              >
                <img src={yawnImg} alt="Yawning" className={imageClass} />
                <span>Yawning</span>
              </button>
              <button
                onClick={() => toggleSound(snoringSound, 7)}
                className={`${buttonClass} ${activeButton === 7 ? 'bg-gray-300' : ''}`}
              >
                <img src={snoringImg} alt="Snoring" className={imageClass} />
                <span>Snoring</span>
              </button>
              <button
                onClick={() => toggleSound(whistleHSound, 8)}
                className={`${buttonClass} ${activeButton === 8 ? 'bg-gray-300' : ''}`}
              >
                <img src={whistleHImg} alt="Whistling" className={imageClass} />
                <span>Whistling</span>
              </button>
              <button
                onClick={() => toggleSound(hummSound, 9)}
                className={`${buttonClass} ${activeButton === 9 ? 'bg-gray-300' : ''}`}
              >
                <img src={hummImg} alt="Humming" className={imageClass} />
                <span>Humming</span>
              </button>
              <button
                onClick={() => toggleSound(shoutSound, 10)}
                className={`${buttonClass} ${activeButton === 10 ? 'bg-gray-300' : ''}`}
              >
                <img src={shoutImg} alt="Shouting" className={imageClass} />
                <span>Shouting</span>
              </button>
            </div>
          </>
        )

      case 5: // Vehicles
        return (
          <>
            <div className="grid grid-cols-5 gap-20">
              <button
                onClick={() => toggleSound(carSound, 1)}
                className={`${buttonClass} ${activeButton === 1 ? 'bg-gray-300' : ''}`}
              >
                <img src={carImg} alt="Car engine" className={imageClass} />
                <span>Car Engine</span>
              </button>
              <button
                onClick={() => toggleSound(bikeSound, 2)}
                className={`${buttonClass} ${activeButton === 2 ? 'bg-gray-300' : ''}`}
              >
                <img src={bikeImg} alt="Motorcycle revving" className={imageClass} />
                <span>Motorcycle Revving</span>
              </button>
              <button
                onClick={() => toggleSound(trainSound, 3)}
                className={`${buttonClass} ${activeButton === 3 ? 'bg-gray-300' : ''}`}
              >
                <img src={trainImg} alt="Train horn" className="h-30 w-35 mb-2 ml-[-7%]" />
                <span className="ml-[-10%]">Train</span>
              </button>
              <button
                onClick={() => toggleSound(airplaneSound, 4)}
                className={`${buttonClass} ${activeButton === 4 ? 'bg-gray-300' : ''}`}
              >
                <img src={airplaneImg} alt="Airplane taking off" className={imageClass} />
                <span className="ml-[2%]">Airplane Taking-off</span>
              </button>
              <button
                onClick={() => toggleSound(bicycleSound, 5)}
                className={`${buttonClass} ${activeButton === 5 ? 'bg-gray-300' : ''}`}
              >
                <img src={bicycleImg} alt="Bicycle bell" className={imageClass} />
                <span>Bicycle bell</span>
              </button>
              <button
                onClick={() => toggleSound(autoSound, 6)}
                className={`${buttonClass} ${activeButton === 6 ? 'bg-gray-300' : ''}`}
              >
                <img src={autoimg} alt="Auto" className="w-28 mb-2" />
                <span>Auto</span>
              </button>
              <button
                onClick={() => toggleSound(helicopterSound, 7)}
                className={`${buttonClass} ${activeButton === 7 ? 'bg-gray-300' : ''}`}
              >
                <img src={helicopterImg} alt="Helicopter" className={imageClass} />
                <span>Helicopter</span>
              </button>
              <button
                onClick={() => toggleSound(busSound, 8)}
                className={`${buttonClass} ${activeButton === 8 ? 'bg-gray-300' : ''}`}
              >
                <img src={busImg} alt="Bus engine" className={imageClass} />
                <span>Bus Engine</span>
              </button>
              <button
                onClick={() => toggleSound(truckSound, 9)}
                className={`${buttonClass} ${activeButton === 9 ? 'bg-gray-300' : ''}`}
              >
                <img src={truckImg} alt="Truck honking" className={imageClass} />
                <span>Truck Honking</span>
              </button>
              <button
                onClick={() => toggleSound(ambulanceSound, 10)}
                className={`${buttonClass} ${activeButton === 10 ? 'bg-gray-300' : ''}`}
              >
                <img src={ambulanceImg} alt="Ambulance" className={imageClass} />
                <span>Ambulance</span>
              </button>
            </div>
          </>
        )

      case 6: // Sports
        return (
          <>
            <div className="grid grid-cols-5 gap-20">
              <button
                onClick={() => toggleSound(whistleSound, 1)}
                className={`${buttonClass} ${activeButton === 1 ? 'bg-gray-300' : ''}`}
              >
                <img src={whistleImg} alt="Whistle blowing" className={imageClass} />
                <span>Whistle Blowing</span>
              </button>
              <button
                onClick={() => toggleSound(crowdSound, 2)}
                className={`${buttonClass} ${activeButton === 2 ? 'bg-gray-300' : ''}`}
              >
                <img src={crowdImg} alt="Crowd cheering" className={imageClass} />
                <span>Crowd Cheering</span>
              </button>
              <button
                onClick={() => toggleSound(basketballSound, 3)}
                className={`${buttonClass} ${activeButton === 3 ? 'bg-gray-300' : ''}`}
              >
                <img
                  src={basketballImg}
                  alt="Basketball bouncing"
                  className="h-30 w-35 mb-2 ml-[-7%]"
                />
                <span className="ml-[-10%]">Basketball Bouncing</span>
              </button>
              <button
                onClick={() => toggleSound(tennisSound, 4)}
                className={`${buttonClass} ${activeButton === 4 ? 'bg-gray-300' : ''}`}
              >
                <img src={tennisImg} alt="Tennis racket hit" className={imageClass} />
                <span className="ml-[2%]">Tennis Racket-hit</span>
              </button>
              <button
                onClick={() => toggleSound(golfSound, 5)}
                className={`${buttonClass} ${activeButton === 5 ? 'bg-gray-300' : ''}`}
              >
                <img src={golfImg} alt="Golf swing" className={imageClass} />
                <span>Golf Swing</span>
              </button>
              <button
                onClick={() => toggleSound(soccerSound, 6)}
                className={`${buttonClass} ${activeButton === 6 ? 'bg-gray-300' : ''}`}
              >
                <img src={soccerImg} alt="Soccer kick" className={imageClass} />
                <span>Soccer Kick</span>
              </button>
              <button
                onClick={() => toggleSound(watersplashSound, 7)}
                className={`${buttonClass} ${activeButton === 7 ? 'bg-gray-300' : ''}`}
              >
                <img src={watersplashImg} alt="Swimming splash" className={imageClass} />
                <span>Swimming Splash</span>
              </button>
              <button
                onClick={() => toggleSound(baseballSound, 8)}
                className={`${buttonClass} ${activeButton === 8 ? 'bg-gray-300' : ''}`}
              >
                <img src={baseballImg} alt="Baseball bat hit" className={imageClass} />
                <span>Baseball Bat-hit</span>
              </button>
              <button
                onClick={() => toggleSound(boxingSound, 9)}
                className={`${buttonClass} ${activeButton === 9 ? 'bg-gray-300' : ''}`}
              >
                <img src={boxingImg} alt="Boxing bell" className={imageClass} />
                <span>Boxing Bell</span>
              </button>
              <button
                onClick={() => toggleSound(racecarSound, 10)}
                className={`${buttonClass} ${activeButton === 10 ? 'bg-gray-300' : ''}`}
              >
                <img src={racecarImg} alt="Sports car" className={imageClass} />
                <span>Race car</span>
              </button>
            </div>
          </>
        )

      case 7: // Music
        return (
          <>
            <div className="grid grid-cols-5 gap-20">
              <button
                onClick={() => toggleSound(mouthorganSound, 1)}
                className={`${buttonClass} ${activeButton === 1 ? 'bg-gray-300' : ''}`}
              >
                <img src={mouthorganImg} alt="mouthorgan" className={imageClass} />
                <span>Mouth Organ</span>
              </button>
              <button
                onClick={() => toggleSound(fluteSound, 6)}
                className={`${buttonClass} ${activeButton === 6 ? 'bg-gray-300' : ''}`}
              >
                <img src={fluteImg} alt="flute" className={imageClass} />
                <span>Flute</span>
              </button>
              <button
                onClick={() => toggleSound(shenaiSound, 7)}
                className={`${buttonClass} ${activeButton === 7 ? 'bg-gray-300' : ''}`}
              >
                <img src={shenaiImg} alt="shehnai" className={imageClass} />
                <span>Shehnai</span>
              </button>
              <button
                onClick={() => toggleSound(pianoSound, 2)}
                className={`${buttonClass} ${activeButton === 2 ? 'bg-gray-300' : ''}`}
              >
                <img src={pianoImg} alt="piano" className={imageClass} />
                <span>Piano</span>
              </button>
              <button
                onClick={() => toggleSound(guitarSound, 3)}
                className={`${buttonClass} ${activeButton === 3 ? 'bg-gray-300' : ''}`}
              >
                <img src={guitarImg} alt="guitar" className="h-30 w-35 mb-2 ml-[-7%]" />
                <span className="ml-[-18%]">Guitar</span>
              </button>
              <button
                onClick={() => toggleSound(violinSound, 4)}
                className={`${buttonClass} ${activeButton === 4 ? 'bg-gray-300' : ''}`}
              >
                <img src={violinImg} alt="violin" className={imageClass} />
                <span className="ml-[-9%]">Violin</span>
              </button>
              <button
                onClick={() => toggleSound(veenaSound, 5)}
                className={`${buttonClass} ${activeButton === 5 ? 'bg-gray-300' : ''}`}
              >
                <img src={veenaImg} alt="veena" className={imageClass} />
                <span className="ml-[-11%]">Veena</span>
              </button>

              <button
                onClick={() => toggleSound(drumsSound, 8)}
                className={`${buttonClass} ${activeButton === 8 ? 'bg-gray-300' : ''}`}
              >
                <img src={drumsImg} alt="drums" className={imageClass} />
                <span className="ml-[-10%]">Drums</span>
              </button>
              <button
                onClick={() => toggleSound(tablaSound, 9)}
                className={`${buttonClass} ${activeButton === 9 ? 'bg-gray-300' : ''}`}
              >
                <img src={tablaImg} alt="tabla" className={imageClass} />
                <span>Tabla</span>
              </button>
              <button
                onClick={() => toggleSound(thavilSound, 10)}
                className={`${buttonClass} ${activeButton === 10 ? 'bg-gray-300' : ''}`}
              >
                <img src={thavilImg} alt="thavil" className={imageClass} />
                <span>Thavil</span>
              </button>
            </div>
          </>
        )

      case 8:
        return (
          <>
            <div className="grid grid-cols-5 gap-20">
              <button
                onClick={() => toggleSound(boingSound, 1)}
                className={`${buttonClass} ${activeButton === 1 ? 'bg-gray-300' : ''}`}
              >
                <img src={boingImg} alt="Boing" className={imageClass} />
                <span>Boing</span>
              </button>
              <button
                onClick={() => toggleSound(slideWhistleSound, 2)}
                className={`${buttonClass} ${activeButton === 2 ? 'bg-gray-300' : ''}`}
              >
                <img src={slideWhistleImg} alt="Slide whistle" className={imageClass} />
                <span>Slide Whistle</span>
              </button>
              <button
                onClick={() => toggleSound(splatSound, 3)}
                className={`${buttonClass} ${activeButton === 3 ? 'bg-gray-300' : ''}`}
              >
                <img src={splatImg} alt="Splat" className="h-30 w-35 mb-2 ml-[-7%]" />
                <span className="ml-[-18%]">Splat</span>
              </button>
              <button
                onClick={() => toggleSound(zapSound, 4)}
                className={`${buttonClass} ${activeButton === 4 ? 'bg-gray-300' : ''}`}
              >
                <img src={zapImg} alt="Zap" className={imageClass} />
                <span className="ml-[-9%]">Zap</span>
              </button>
              <button
                onClick={() => toggleSound(boinkSound, 5)}
                className={`${buttonClass} ${activeButton === 5 ? 'bg-gray-300' : ''}`}
              >
                <img src={boinkImg} alt="Boink" className={imageClass} />
                <span className="ml-[-11%]">Boink</span>
              </button>
              <button
                onClick={() => toggleSound(whirlSound, 6)}
                className={`${buttonClass} ${activeButton === 6 ? 'bg-gray-300' : ''}`}
              >
                <img src={whirlImg} alt="Whirl" className={imageClass} />
                <span>Whirl</span>
              </button>
              <button
                onClick={() => toggleSound(honkSound, 7)}
                className={`${buttonClass} ${activeButton === 7 ? 'bg-gray-300' : ''}`}
              >
                <img src={honkImg} alt="Honk" className={imageClass} />
                <span>Honk</span>
              </button>
              <button
                onClick={() => toggleSound(tootSound, 8)}
                className={`${buttonClass} ${activeButton === 8 ? 'bg-gray-300' : ''}`}
              >
                <img src={tootImg} alt="Toot" className={imageClass} />
                <span className="ml-[-10%]">Toot</span>
              </button>
              <button
                onClick={() => toggleSound(popSound, 9)}
                className={`${buttonClass} ${activeButton === 9 ? 'bg-gray-300' : ''}`}
              >
                <img src={popImg} alt="Pop" className={imageClass} />
                <span>Pop</span>
              </button>
              <button
                onClick={() => toggleSound(whooshSound, 10)}
                className={`${buttonClass} ${activeButton === 10 ? 'bg-gray-300' : ''}`}
              >
                <img src={whooshImg} alt="Whoosh" className={imageClass} />
                <span>Whoosh</span>
              </button>
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex w-screen h-screen bg-[#ffcc9a] overflow-hidden relative">
      <div className="w-[4.5%] h-max gap-5 items-center rounded-br-3xl flex flex-col justify-between py-4 bg-[#ffffff]">
        <Link to="/home" className="w-[70%] rounded-full">
          <img src={home} alt="home" className="rounded-full" />
        </Link>
      </div>

      <div className="flex flex-col w-[95.5%] relative">
        <div className="w-full h-[10vh] flex items-center justify-center text-black font-sans font-bold lg:text-5xl md:text-3xl mb-10 py-9">
          Listening Studio
          <img
            src={topright}
            alt="Top Right"
            className="absolute top-0 right-0 h-[13%] md:h-[15%] lg:h-[20%]"
          />
        </div>
        <img
          src={bottomleft}
          alt="Bottom Left Image"
          className="absolute bottom-0 left-[-5%] h-[18%] md:h-[25%] lg:h-[40%] rotate-180 -ml-[20px]"
          style={{ transform: 'rotate(360deg)' }}
        />

        <div className="flex h-[72%] items-center justify-left flex-wrap relative left-[150px] overflow-y-auto">
          <div className="flex flex-col md:flex-cols lg:flex-cols gap-10 w-[20%]  h-full p-5">
            {items.map((item) => (
              <a
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`bg-white rounded-lg hover:shadow-xl flex items-center p-5 cursor-pointer ${item.id === selectedItem?.id ? 'bg-blue-300' : ''}`}
              >
                <div className="text-2xl font-bold flex-1">{item.text}</div>
                <img
                  src={item.imageSrc}
                  alt={`Image ${item.id}`}
                  className="h-[100px] object-contain"
                />
              </a>
            ))}
          </div>
        </div>
        <img src={edsolslogo} className="absolute bottom-[1%] right-[1%] h-[5%]" alt="logo" />

        {/* Detail Box */}
        {selectedItem && (
          <div className="fixed top-[20%] right-[4%] h-[70%] w-[60%] bg-white shadow-lg rounded-lg p-6 overflow-auto">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-0 right-2 text-gray-600 hover:text-gray-900"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              &times;
            </button>
            <h2 className="text-3xl font-bold mb-4">{selectedItem.text}</h2>
            <div>{renderButtonsForId(selectedItem.id)}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Listeningstudio
