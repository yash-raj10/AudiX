import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaMicrophone,
  FaPauseCircle,
  FaPlay,
  FaStop,
  FaTrash,
} from "react-icons/fa";
import WaveSurfer from "wavesurfer.js";
import { IoMdSend } from "react-icons/io";
import axios from "axios";

const CapturAudio = ({ hide, image, name, email }) => {
  const [isRecording, setIsRecording] = useState(true);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [waveForm, setWaveForm] = useState(null);
  const [recodingDuration, setRecodingDuration] = useState(0);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [renderedAudio, setRenderedAudio] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecodingDuration((prevDuration) => {
          setTotalDuration(prevDuration + 1);
          return prevDuration + 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRecording]);

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const waveFormRef = useRef(null);

  const { register, reset, setValue, watch, handleSubmit } = useForm({});

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: waveFormRef.current,
      waveColor: "#ccc",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      barWidth: 2,
      height: 30,
      responsive: true,
    });
    setWaveForm(wavesurfer);

    wavesurfer.on("finish", () => {
      setIsPlaying(false);
    });

    return () => {
      wavesurfer.destroy();
    };
  }, []);

  useEffect(() => {
    if (waveForm) handleStartRecording();
  }, [waveForm]);

  const handleStartRecording = () => {
    setRecordedAudio(null);
    setRecodingDuration(0);
    setCurrentPlaybackTime(0);
    setTotalDuration(0);
    setIsRecording(true);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioRef.current.srcObject = stream;

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/ogg: codecs=opus" });
          const audioURL = URL.createObjectURL(blob);
          const audio = new Audio(audioURL);
          setRecordedAudio(audio);

          waveForm.load(audioURL);
        };

        mediaRecorder.start();
      })
      .catch((error) => {
        console.error("Error in accessing microphone:", error);
      });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      waveForm.stop();

      const audioChunks = [];
      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      var datetime = new Date().toLocaleString();
      alert(datetime);
      // console.log(typeof datetime);

      mediaRecorderRef.current.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const audioFile = new File([audioBlob], `${datetime}.mp3`);
        setRenderedAudio(audioFile);
      });
    }
  };

  useEffect(() => {
    if (recordedAudio) {
      const updatePlaybackTime = () => {
        setCurrentPlaybackTime(recordedAudio.currentTime);
      };
      recordedAudio.addEventListener("timeupdate", updatePlaybackTime);
      return () => {
        recordedAudio.removeEventListener("timeupdate", updatePlaybackTime);
      };
    }
  }, [recordedAudio]);

  const handlePlayRecording = () => {
    console.error("hlo");
    if (recordedAudio) {
      waveForm.stop();
      waveForm.play();
      recordedAudio.play();
      setIsPlaying(true);
    }
  };

  const handlePauseRecording = () => {
    waveForm.stop();
    recordedAudio.pause();
    setIsPlaying(false);
  };

  const sendRecording = async (data) => {
    alert("sent");
    console.log("sent");
    // console.log(data);
    try {
      const formData = new FormData();
      formData.append("audio", renderedAudio);
      formData.append("name", data.Name);
      console.log(formData);
      const response = await axios.post(
        "http://localhost:8080/upload",
        formData,
        // data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response);

      if (response.status === 200) {
        setAudioUrl(response.data.audio);
        // console.log("START HERE");
        // console.log(typeof response.data);
        // console.log(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex-col">
      <form onSubmit={handleSubmit(sendRecording)}>
        <div className="flex text-2xl w-full justify-end items-center">
          <div className="pt-1">
            <FaTrash
              className="text-panel-header-icon"
              onClick={() => hide()}
            />
          </div>

          <div className=" mx-4 py-2 px-4 border-2 rounded-full bg-zinc-500 w-96 text-white text-lg flex gap-3 justify-center items-center ">
            {isRecording ? (
              <div className=" text-red-700 animate-pulse w-96 text-center">
                Recording <span>{recodingDuration}</span>
              </div>
            ) : (
              <div className="">
                {recordedAudio && (
                  <>
                    {!isPlaying ? (
                      <FaPlay
                        className="text-black"
                        onClick={handlePlayRecording}
                      />
                    ) : (
                      <FaStop
                        className="text-black"
                        onClick={handlePauseRecording}
                      />
                    )}
                  </>
                )}
              </div>
            )}
            <div className="w-60" ref={waveFormRef} hidden={isRecording} />
            {recordedAudio && isPlaying && (
              <span
              //  className="text-gray-600"
              >
                {formatTime(currentPlaybackTime)}
              </span>
            )}
            {recordedAudio && !isPlaying && (
              <span
              // className="text-gray-600"
              >
                {formatTime(totalDuration)}
              </span>
            )}
            <audio ref={audioRef} hidden />
          </div>

          <div className="mr-4">
            {!isRecording ? (
              <FaMicrophone
                className="text-red-500"
                onClick={handleStartRecording}
              />
            ) : (
              <FaPauseCircle
                className="text-red-500"
                onClick={handleStopRecording}
              />
            )}
          </div>

          <div>
            {" "}
            <button type="submit">
              <IoMdSend
                className="text-panel-header-icon cursor-pointe text-black"
                title="Send"
              />
            </button>
          </div>
        </div>
        {audioUrl && (
          <div className="flex items-center justify-center mt-5">
            <h2>Uploaded Audio</h2>
            <audio controls>
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        <div className="">
          <input
            className="hidden"
            type=""
            defaultValue="Yash Raj"
            {...register("Name")}
          />
        </div>
      </form>
    </div>
  );
};

export default CapturAudio;
