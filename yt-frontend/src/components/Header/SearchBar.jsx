import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    navigate(`/search/${data?.query}`);
  };
  return (
    <div>SearchBar</div>
  )
}

export default SearchBar