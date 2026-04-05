<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CvAnalyzeRequest extends FormRequest
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
            'cv_text' => ['required', 'string', 'min:30', 'max:20000'],
            'target_role' => ['nullable', 'string', 'max:150'],
            'target_country' => ['nullable', 'string', 'max:100'],
        ];
    }

    /**
     * Get custom validation messages.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'cv_text.required' => 'CV text is required for analysis.',
            'cv_text.min' => 'CV text must be at least 30 characters.',
            'cv_text.max' => 'CV text is too long. Please keep it under 20,000 characters.',
        ];
    }
}
