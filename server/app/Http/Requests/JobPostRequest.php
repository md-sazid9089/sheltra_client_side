<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JobPostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'min:50', 'max:5000'],
            'role_type' => ['required', 'in:full_time,part_time,contract,temporary,internship'],
            'location' => ['required', 'string', 'max:255'],
            'salary_min' => ['nullable', 'numeric', 'min:0'],
            'salary_max' => ['nullable', 'numeric', 'gte:salary_min'],
            'required_skills' => ['required', 'array', 'min:1'],
            'required_skills.*' => ['string', 'max:100'],
            'preferred_skills' => ['nullable', 'array'],
            'preferred_skills.*' => ['string', 'max:100'],
            'experience_years' => ['nullable', 'numeric', 'min:0', 'max:50'],
            'num_positions' => ['required', 'integer', 'min:1'],
        ];
    }

    /**\n     * Get the error messages for the defined validation rules.\n     *\n     * @return array\n     */\n    public function messages()\n    {\n        return [\n            'title.required' => 'Job title is required.',\n            'description.required' => 'Job description is required.',\n            'description.min' => 'Job description must be at least 50 characters.',\n            'role_type.required' => 'Job type is required.',\n            'location.required' => 'Location is required.',\n            'salary_max.gte' => 'Maximum salary must be greater than or equal to minimum salary.',\n            'required_skills.required' => 'At least one required skill must be specified.',\n            'num_positions.required' => 'Number of positions is required.',\n            'num_positions.min' => 'Number of positions must be at least 1.',\n        ];\n    }\n}
