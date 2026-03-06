<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NGOCaseNoteRequest extends FormRequest
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
            'note' => ['required', 'string', 'min:10', 'max:2000'],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'note.required' => 'Case note is required.',
            'note.min' => 'Case note must be at least 10 characters.',
            'note.max' => 'Case note cannot exceed 2000 characters.',
        ];
    }
}
