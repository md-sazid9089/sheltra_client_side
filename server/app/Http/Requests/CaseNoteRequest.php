<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CaseNoteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->role === 'ngo';
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'note' => 'required|string|max:5000',
        ];
    }

    /**
     * Get custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'note.required' => 'Case note is required',
        ];
    }
}
