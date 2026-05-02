<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTestReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'device_model' => ['required', 'string'],
            'device_os' => ['nullable', 'string'],
            'browser' => ['nullable', 'string'],
            'screen_size' => ['nullable', 'string'],
            'connectivity' => ['required', 'in:wifi,4g,3g,offline'],

            // Checklist features
            'features_tested' => ['nullable', 'array'],
            'features_tested.*.feature' => ['required', 'string'],
            'features_tested.*.status' => ['required', 'in:pass,fail,skip'],
            'features_tested.*.notes' => ['nullable', 'string'],

            // Bugs signalés
            'bugs' => ['nullable', 'array'],
            'bugs.*.title' => ['required_with:bugs', 'string'],
            'bugs.*.severity' => ['required_with:bugs', 'in:low,medium,high,critical'],
            'bugs.*.steps' => ['required_with:bugs', 'string'],
            'bugs.*.expected' => ['nullable', 'string'],
            'bugs.*.actual' => ['nullable', 'string'],
            
            // Note globale
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'notes' => ['required', 'string'],

            // Fichiers/Screenshots
            'media' => ['nullable', 'array'],
            'media.*' => ['file', 'mimes:jpg,jpeg,png,mp4', 'max:10240'],
        ];
    }
}
