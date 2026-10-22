import React, { useState, useEffect } from 'react';
import { sampleQuizQuestions } from '../data/initialData';
import { QuizQuestion } from '../types';
import { CheckCircle2, XCircle, RotateCcw, Flame, HelpCircle, ChevronRight, Award } from 'lucide-react';

export const QuizDuel: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(sampleQuizQuestions);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);

  const currentQ = questions[currentIndex];

  useEffect(() => {
    if (isAnswered || isQuizComplete) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isAnswered, isQuizComplete]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    setSelectedOption(-1); // timed out
    setStreak(0);
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQ.correctIndex) {
      const addedPoints = 100 + streak * 25 + timeLeft * 5;
      setScore((prev) => prev + addedPoints);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(20);
    } else {
      setIsQuizComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setTimeLeft(20);
    setIsQuizComplete(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            Bilgi Düellosu <span className="text-xs font-normal text-slate-500">· Sınıf Yarışması</span>
          </h3>
          <p className="text-xs text-slate-500">Derste akıllı tahtada veya bireysel soru-cevap düellosu</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-amber-600 font-medium">
            <Flame size={15} />
            <span className="tabular-nums font-mono">{streak} Seri</span>
          </div>
          <div className="text-xs font-semibold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md tabular-nums font-mono">
            {score} Puan
          </div>
        </div>
      </div>

      {!isQuizComplete ? (
        <div>
          {/* Header Bar: Question index & Category & Timer */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700">Soru {currentIndex + 1} / {questions.length}</span>
              <span aria-hidden="true">·</span>
              <span className="text-indigo-600 font-medium">{currentQ.category}</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono tabular-nums">
              <span className={timeLeft <= 5 ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                {timeLeft}s
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-4">
            <div
              className={`h-full transition-all duration-1000 ${
                timeLeft <= 5 ? 'bg-rose-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${(timeLeft / 20) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-100 min-h-[75px] flex items-center">
            <p className="text-sm font-medium text-slate-900 leading-relaxed">
              {currentQ.question}
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;
              let btnClass = 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50';

              if (isAnswered) {
                if (isCorrect) {
                  btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-medium';
                } else if (isSelected) {
                  btnClass = 'border-rose-400 bg-rose-50 text-rose-900';
                } else {
                  btnClass = 'border-slate-200 opacity-50 bg-slate-50 text-slate-500';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`p-3 text-left text-xs sm:text-sm rounded-lg border transition-all flex items-center justify-between cursor-pointer ${btnClass}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-[11px] font-semibold text-slate-600 shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>
                  {isAnswered && isCorrect && <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle size={16} className="text-rose-500 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation if answered */}
          {isAnswered && (
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 mb-4 flex items-start gap-2">
              <HelpCircle size={15} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">Çözüm / Açıklama:</span>
                <p>{currentQ.explanation}</p>
              </div>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {currentIndex + 1 === questions.length ? 'Sonuçları Gör' : 'Sıradaki Soru'}
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Complete Screen */
        <div className="py-6 text-center space-y-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
            <Award size={26} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900">Düello Tamamlandı!</h4>
            <p className="text-xs text-slate-500 mt-1">Soruların tamamını başarıyla yanıtladınız.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto text-left">
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
              <span className="text-[11px] text-slate-500 block">Toplam Puan</span>
              <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">{score}</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
              <span className="text-[11px] text-slate-500 block">En Uzun Seri</span>
              <span className="text-lg font-bold text-amber-600 font-mono tabular-nums">{maxStreak} Soru</span>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw size={14} /> Yeniden Başla
          </button>
        </div>
      )}
    </div>
  );
};
