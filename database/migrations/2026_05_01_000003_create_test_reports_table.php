<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('test_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('test_session_id')->constrained('test_sessions')->cascadeOnDelete();
            $table->string('device_model');
            $table->string('device_os');
            $table->string('screen_size')->nullable();
            $table->enum('environment', ['real_device', 'emulator', 'browser']);
            $table->string('browser')->nullable();
            $table->string('connectivity')->nullable(); // wifi, 4g, 3g, offline
            $table->json('features_tested'); // [{feature: string, status: pass|fail|skip, notes: string}]
            $table->json('bugs')->nullable(); // [{severity: critical|major|minor|cosmetic, description, steps, screenshot_url}]
            $table->unsignedTinyInteger('rating'); // 1-5
            $table->text('notes')->nullable();
            $table->json('screenshots')->nullable(); // [url1, url2, ...]
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('test_reports');
    }
};
