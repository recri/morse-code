/*
** Scan touch inputs and maintain touch state.
*/
#include "WProgram.h"
#include "Teensy3Touch.h"

uint16_t Teensy3Touch::_first_channel;
uint16_t Teensy3Touch::_channel;
uint16_t Teensy3Touch::_channels;
uint16_t Teensy3Touch::_value[12];
uint16_t Teensy3Touch::_minValue[12];
uint16_t Teensy3Touch::_maxValue[12];
uint16_t Teensy3Touch::_threshold[12];
uint16_t Teensy3Touch::_touched;
uint16_t Teensy3Touch::_partial;
uint16_t Teensy3Touch::_error;
