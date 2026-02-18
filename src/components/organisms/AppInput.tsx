'use client'
import React, { useState } from "react";
import { VscEye, VscEyeClosed } from "react-icons/vsc";

interface AppInputProps {
  label?: string;
  error?: string;
  textareaHeight?: string;
  maxLength?: number;
  max?: number;
  checked?: boolean;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  display?: "col" | "row";
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

function makeid(length: number): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export default function AppInput({
  label,
  error,
  textareaHeight,
  maxLength,
  checked,
  type = "text",
  disabled,
  required,
  placeholder,
  name,
  max,
  value,
  defaultValue,
  display,
  onChange,
}: AppInputProps) {
  const [inputType, setInputType] = useState(type);
  const Fid = makeid(7);

  return (
    <div className="select-none">
      <div className="space-y-2">
        <div>
          {type !== "checkbox" && type !== "radio" && (
            <label className="font-medium text-gray-600 text-sm">{label}</label>
          )}
        </div>
        <div className="text-[16px] relative rounded-lg">
          {type === "checkbox" || type === "radio" ? (
            <div className="flex text-sm">
              <div className={`space-x-2 relative -left-2 flex select-none items-center justify-center ${display === "col" ? "flex-col pb-6" : ""}`}>
                <input
                  type={type}
                  id={name + Fid}
                  className="peer group opacity-0 appearance-none"
                  name={name}
                  required={required}
                  maxLength={maxLength}
                  value={value}
                  checked={!!checked}
                  defaultValue={defaultValue}
                  onChange={(e) => onChange?.(e as React.ChangeEvent<HTMLInputElement>)}
                />
                <div className="relative top-[1px] bg-white w-5 h-5 rounded-md border peer-hover:hidden peer-checked:hidden ">
                  <div className="w-5 h-5" />
                </div>
                <div className="relative top-[1px] text-xs bg-white w-5 h-5 rounded-md peer-checked:bg-bub-primary hidden peer-checked:flex peer-hover:border peer-hover:flex items-center justify-center text-gray-300 peer-checked:text-white ">
                  <div className="w-5 h-5 flex items-center justify-center"><i className="ri-check-line"></i></div>
                </div>
                <label htmlFor={name + Fid} className={`cursor-pointer ${label === undefined ? "w-1 h-6" : ""} flex gap-1 ${display === "col" ? "pt-8 px-2 -top-0 absolute" : "pl-9 right-9 relative top-0.5"}`}>
                  <span className="first-letter:capitalize text-tertiary-base2 leading-[20px]">{label}</span>
                </label>
              </div>
            </div>
          ) : type === "textarea" ? (
            <textarea
              name={name}
              required={required}
              value={value}
              disabled={disabled}
              placeholder={placeholder}
              onChange={(e) => onChange?.(e)}
              defaultValue={defaultValue}
              maxLength={maxLength}
              className={`${textareaHeight ?? ""} bg-white w-full resize-none border ${error ? "border-red-500" : "border-black"} disabled:bg-gray-100 appearance-none focus:border-primary disabled:border-gray-100 disabled:cursor-default border-gray-300 p-3 peer outline-none rounded-2xl text-sm`}
            />
          ) : (
            <input
              name={name}
              required={required}
              type={inputType}
              value={value}
              disabled={disabled}
              placeholder={placeholder}
              onChange={(e) => onChange?.(e)}
              defaultValue={defaultValue}
              className={`w-full border ${error ? "border-red-500" : "border-black"} disabled:bg-gray-100 appearance-none focus:border-primary disabled:border-gray-100 disabled:cursor-default border-gray-300 p-3 peer outline-none rounded-2xl text-sm`}
              maxLength={maxLength}
              {...(max !== undefined ? { max } : {})}
            />
          )}
          {type === "password" && (
            <div
              className="absolute cursor-pointer text-black peer-focus:text-black peer-placeholder-shown:text-gray-300 right-3 top-4"
              onClick={() => setInputType(inputType === "password" ? "text" : "password")}
            >
              {inputType !== "password" ? <VscEye /> : <VscEyeClosed />}
            </div>
          )}
        </div>
      </div>
      {error && <div className="text-red-500 text-xs">{error}</div>}
    </div>
  );
}
